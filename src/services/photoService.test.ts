import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { preparePhoto, validatePhotoFile, MAX_FILE_SIZE } from "./photoService";

const signatures = {
  "image/png": [137, 80, 78, 71, 13, 10, 26, 10],
  "image/jpeg": [255, 216, 255, 224],
  "image/webp": [82, 73, 70, 70, 0, 0, 0, 0, 87, 69, 66, 80],
};
function file(type: keyof typeof signatures = "image/png") {
  return new File([new Uint8Array(signatures[type])], "photo", { type });
}

describe("підготовка фотографії", () => {
  let width: number, height: number, mode: "load" | "error" | "timeout";
  const drawImage = vi.fn();
  const fillRect = vi.fn();
  const revoke = vi.fn();
  const output = new Blob(["encoded"], { type: "image/jpeg" });
  const canvas = { width: 0, height: 0, getContext: vi.fn(), toBlob: vi.fn() };
  beforeEach(() => {
    width = 3200;
    height = 2400;
    mode = "load";
    vi.stubGlobal(
      "Image",
      class {
        naturalWidth = width;
        naturalHeight = height;
        onload?: () => void;
        onerror?: () => void;
        set src(_value: string) {
          queueMicrotask(() => {
            if (mode === "load") this.onload?.();
            else if (mode === "error") this.onerror?.();
          });
        }
      },
    );
    canvas.getContext.mockReturnValue({ fillStyle: "", fillRect, drawImage });
    canvas.toBlob.mockImplementation((callback: BlobCallback) =>
      callback(output),
    );
    vi.stubGlobal("document", { createElement: vi.fn(() => canvas) });
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:test");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(revoke);
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it.each(Object.keys(signatures) as (keyof typeof signatures)[])(
    "приймає сигнатуру %s і створює JPEG 1600×1200",
    async (type) => {
      expect(await preparePhoto(file(type))).toBe(output);
      expect([canvas.width, canvas.height]).toEqual([1600, 1200]);
      expect(fillRect).toHaveBeenCalledWith(0, 0, 1600, 1200);
      expect(drawImage).toHaveBeenCalledWith(
        expect.anything(),
        0,
        0,
        1600,
        1200,
      );
      expect(canvas.toBlob).toHaveBeenCalledWith(
        expect.any(Function),
        "image/jpeg",
        0.85,
      );
      expect(revoke).toHaveBeenCalledWith("blob:test");
    },
  );
  it("не збільшує маленьке фото", async () => {
    width = 240;
    height = 320;
    await preparePhoto(file());
    expect([canvas.width, canvas.height]).toEqual([240, 320]);
  });
  it("зменшує вертикальне фото зі збереженням пропорцій", async () => {
    width = 2000;
    height = 4000;
    await preparePhoto(file());
    expect([canvas.width, canvas.height]).toEqual([800, 1600]);
  });
  it.each([
    [0, 100],
    [100, 0],
    [6000, 5000],
    [12001, 1],
    [1, 12001],
  ])("відхиляє небезпечні розміри %i×%i і звільняє URL", async (w, h) => {
    width = w;
    height = h;
    await expect(preparePhoto(file())).rejects.toThrow("24 Мп");
    expect(drawImage).not.toHaveBeenCalled();
    expect(revoke).toHaveBeenCalledOnce();
  });
  it("приймає граничну роздільність 24 Мп", async () => {
    width = 6000;
    height = 4000;
    await expect(preparePhoto(file())).resolves.toBe(output);
  });
  it("не довіряє MIME-типу за неправильної сигнатури", async () => {
    await expect(
      preparePhoto(
        new File([new Uint8Array(signatures["image/png"])], "fake.jpg", {
          type: "image/jpeg",
        }),
      ),
    ).rejects.toThrow("заявленому формату");
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });
  it("повідомляє про пошкоджені дані декодеру", async () => {
    mode = "error";
    await expect(preparePhoto(file())).rejects.toThrow("Файл пошкоджений");
    expect(revoke).toHaveBeenCalledOnce();
  });
  it("обмежує час декодування і звільняє URL", async () => {
    vi.useFakeTimers();
    mode = "timeout";
    const result = expect(preparePhoto(file())).rejects.toThrow(
      "Не вдалося прочитати",
    );
    await vi.advanceTimersByTimeAsync(15001);
    await result;
    expect(revoke).toHaveBeenCalledOnce();
  });
  it("обробляє відсутність Canvas без витоку URL", async () => {
    canvas.getContext.mockReturnValue(null);
    await expect(preparePhoto(file())).rejects.toThrow("Браузер не підтримує");
    expect(revoke).toHaveBeenCalledOnce();
  });
  it("обробляє помилку кодування JPEG", async () => {
    canvas.toBlob.mockImplementation((callback: BlobCallback) =>
      callback(null),
    );
    await expect(preparePhoto(file())).rejects.toThrow(
      "Не вдалося підготувати",
    );
    expect(revoke).toHaveBeenCalledOnce();
  });
  it("приймає рівно 10 МіБ", () => {
    expect(() =>
      validatePhotoFile(
        new File([new Uint8Array(MAX_FILE_SIZE)], "limit.png", {
          type: "image/png",
        }),
      ),
    ).not.toThrow();
  });
});
