export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export function validatePhotoFile(file: File) {
  if (!file.size) throw new Error("Файл порожній. Оберіть інше фото.");
  if (file.size > MAX_FILE_SIZE)
    throw new Error("Фото завелике. Максимум 10 МіБ.");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error("Оберіть фото JPEG, PNG або WebP.");
}
export async function preparePhoto(file: File): Promise<Blob> {
  validatePhotoFile(file);
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const png = [137, 80, 78, 71, 13, 10, 26, 10].every(
    (value, i) => bytes[i] === value,
  );
  const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  const webp =
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  if (!(
    (file.type === "image/png" && png) ||
    (file.type === "image/jpeg" && jpeg) ||
    (file.type === "image/webp" && webp)
  ))
    throw new Error("Файл пошкоджений або не відповідає заявленому формату.");
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error("Не вдалося прочитати фото. Оберіть інше.")),
        15000,
      );
      image.onload = () => {
        clearTimeout(timer);
        resolve();
      };
      image.onerror = () => {
        clearTimeout(timer);
        reject(new Error("Не вдалося прочитати фото. Файл пошкоджений."));
      };
      image.src = url;
    });
    const width = image.naturalWidth,
      height = image.naturalHeight;
    if (
      !width ||
      !height ||
      width * height > 24_000_000 ||
      width > 12000 ||
      height > 12000
    )
      throw new Error(
        "Фото має містити не більше 24 Мп та 12000 px на сторону.",
      );
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, 1600 / Math.max(width, height));
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Браузер не підтримує підготовку фото.");
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (blob) =>
          blob
            ? resolve(blob)
            : reject(new Error("Не вдалося підготувати фото.")),
        "image/jpeg",
        0.85,
      ),
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}
