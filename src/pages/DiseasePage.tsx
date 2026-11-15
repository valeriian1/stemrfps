import { referencePhotos } from "../data/referencePhotos";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getDisease } from "../data/wheatDiseases";
import DiseaseReference from "../components/DiseaseReference";

export default function DiseasePage() {
  const { diseaseId } = useParams();
  const disease = getDisease(diseaseId ?? "");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [diseaseId]);
  if (!disease) {
    return (
      <div className="page-stack">
        <h1>Хворобу не знайдено</h1>
        <Link to="/diseases">Повернутися до довідника</Link>
      </div>
    );
  }
  const photo = referencePhotos[disease.id];
  return (
    <article className="page-stack">
      <Link to="/diseases">← До довідника</Link>
      <header className="page-heading">
        <h1>{disease.nameUk}</h1>
        <p>
          <i>{disease.scientificName}</i>
        </p>
      </header>
      <DiseaseReference key={disease.id} diseaseId={disease.id} magnify />
      <p>
        {disease.summary} {disease.symptoms}
      </p>
      <div className="disease-accordion">
        <details>
          <summary>На що звернути увагу під час огляду</summary>
          <div className="form-stack">
            <ul>
              {disease.observations.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </div>
        </details>
        <details>
          <summary>Загальні наступні дії</summary>
          <div className="form-stack">
            <p>{disease.generalActions}</p>
            <p className="muted">
              Довідковий опис не є підтвердженням діагнозу на вашому фото.
            </p>
          </div>
        </details>
        <details>
          <summary>Джерела</summary>
          <div className="form-stack">
            <p>
              Фото: {photo.title}. Автор: {photo.author}.{" "}
              <a href={photo.source} target="_blank" rel="noopener noreferrer">
                Джерело фото
              </a>
              {" · "}
              <a
                href={photo.licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {photo.license}
              </a>
              . Без змін.
            </p>
            <ul>
              {disease.sources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {source.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </details>
      </div>
    </article>
  );
}
