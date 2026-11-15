import { Link, Navigate, useSearchParams } from "react-router-dom";
import { referencePhotos } from "../data/referencePhotos";
import { diseases, getDisease } from "../data/wheatDiseases";

export default function DiseasesPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const words = query
    .trim()
    .toLocaleLowerCase("uk-UA")
    .split(/\s+/)
    .filter(Boolean);
  const matches = diseases.filter((disease) => {
    const text =
      `${disease.nameUk} ${disease.scientificName} ${disease.summary} ${disease.symptoms}`.toLocaleLowerCase(
        "uk-UA",
      );
    return words.every((word) => text.includes(word));
  });
  function search(value: string) {
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value) next.set("q", value);
        else next.delete("q");
        return next;
      },
      { replace: true },
    );
  }
  const selected = params.get("disease");
  if (selected && getDisease(selected)) {
    return <Navigate to={`/diseases/${selected}`} replace />;
  }
  return (
    <div className="page-stack">
      <header className="page-heading">
        <h1>Довідник хвороб пшениці</h1>
      </header>
      <div className="catalog-toolbar">
        <div className="catalog-search">
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 4 4" />
          </svg>
          <input
            type="search"
            aria-label="Пошук хвороби"
            placeholder="Назва хвороби або симптоми"
            value={query}
            onChange={(event) => search(event.target.value)}
          />
          {query && (
            <button
              type="button"
              aria-label="Очистити пошук"
              onClick={() => search("")}
            >
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          )}
        </div>
        {words.length > 0 && (
          <p className="muted catalog-count" role="status">
            Знайдено: {matches.length} із {diseases.length}
          </p>
        )}
      </div>
      {matches.length === 0 && (
        <p className="catalog-empty">Хвороб не знайдено</p>
      )}
      <div className="disease-grid">
        {matches.map((disease, index) => (
          <article className="panel disease-summary" key={disease.id}>
            <img
              src={referencePhotos[disease.id].src
                .replace("/reference/", "/reference/thumbs/")
                .replace(".jpg", "-640.webp")}
              srcSet={[320, 640, 960]
                .map(
                  (width) =>
                    `${referencePhotos[disease.id].src.replace("/reference/", "/reference/thumbs/").replace(".jpg", `-${width}.webp`)} ${width}w`,
                )
                .join(", ")}
              sizes="(max-width: 600px) calc(100vw - 120px), (max-width: 900px) 50vw, 33vw"
              alt=""
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding="async"
              width="640"
              height="480"
            />
            <div className="disease-title">
              <h2 className="disease-name">{disease.nameUk}</h2>
              <p className="disease-description">{disease.summary}</p>
              <Link
                to={`/diseases/${disease.id}`}
                aria-label={`Детальніше — ${disease.nameUk}`}
              >
                Детальніше
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
