import { referencePhotos } from "../data/referencePhotos";
import { useState, type PointerEvent } from "react";

export default function DiseaseReference({
  diseaseId,
  magnify = false,
}: {
  diseaseId: keyof typeof referencePhotos;
  magnify?: boolean;
}) {
  const photo = referencePhotos[diseaseId];
  const [lens, setLens] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  function moveLens(event: PointerEvent<HTMLDivElement>) {
    if (!magnify || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    setLens({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      width: rect.width,
      height: rect.height,
    });
  }
  const lensWidth = lens ? Math.min(180, lens.width) : 180;
  const lensHeight = lens ? Math.min(130, lens.height) : 130;
  return (
    <figure className="reference-photo">
      <div
        className={magnify ? "photo-magnifier" : undefined}
        onPointerMove={moveLens}
        onPointerLeave={() => setLens(null)}
        onPointerCancel={() => setLens(null)}
      >
        <img
          src={photo.src}
          alt={`Довідковий приклад: ${photo.title}`}
          loading="lazy"
        />
        {magnify && lens && (
          <div
            className="photo-lens"
            aria-hidden="true"
            style={{
              width: lensWidth,
              height: lensHeight,
              left: Math.max(
                0,
                Math.min(lens.x - lensWidth / 2, lens.width - lensWidth),
              ),
              top: Math.max(
                0,
                Math.min(lens.y - lensHeight / 2, lens.height - lensHeight),
              ),
              backgroundImage: `url("${photo.src}")`,
              backgroundSize: `${lens.width * 2.5}px ${lens.height * 2.5}px`,
              backgroundPosition: `${Math.min(0, Math.max(lensWidth - lens.width * 2.5, lensWidth / 2 - lens.x * 2.5))}px ${Math.min(0, Math.max(lensHeight - lens.height * 2.5, lensHeight / 2 - lens.y * 2.5))}px`,
            }}
          />
        )}
      </div>
      <figcaption>{photo.title}</figcaption>
    </figure>
  );
}
