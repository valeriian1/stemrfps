import { Link } from "react-router-dom";
import { getDisease } from "../data/wheatDiseases";
import { outcomeLabels, type AnalysisResult } from "../domain/wheat";

export default function AnalysisResultView({
  result,
  preview,
}: {
  result: AnalysisResult;
  preview?: string;
}) {
  const disease = getDisease(result.predictions[0]?.diseaseId);
  const affected = result.affectedAreaPercent;
  return (
    <section className="analytics" aria-label="Звіт аналізу">
      <div className="analytics-heading">
        <h2>Результат аналізу</h2>
        <button
          className="button secondary export-report"
          onClick={() => window.print()}
          title="Відкрити друк і вибрати «Зберегти як PDF»"
        >
          Експортувати звіт
        </button>
      </div>
      <div className="analytics-grid">
        {preview && (
          <figure className="analytics-photo">
            <img src={preview} alt="Фото листка для аналізу" />
            <figcaption>Завантажене фото</figcaption>
          </figure>
        )}
        <div className="analytics-data">
          {disease ? (
            <div className="diagnosis-summary">
              <p className="muted">Ймовірна хвороба</p>
              <h3>{disease.nameUk}</h3>
              <p>{disease.summary}</p>
              <Link to={`/diseases/${disease.id}`}>
                Детальніше про хворобу →
              </Link>
            </div>
          ) : (
            <p>{outcomeLabels[result.outcome]}</p>
          )}
          {affected !== undefined && (
            <div className="area-stat">
              <h3>Площа ураження</h3>
              <div className="area-stat-body">
                <div
                  className="area-ring"
                  role="img"
                  aria-label={`Приклад: уражено ${affected}% площі листка`}
                >
                  <svg viewBox="0 0 120 120" aria-hidden="true">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="#e6eddc"
                      strokeWidth="14"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="#b78b42"
                      strokeWidth="14"
                      strokeLinecap="round"
                      pathLength="100"
                      strokeDasharray={`${affected} 100`}
                      transform="rotate(-90 60 60)"
                    />
                  </svg>
                  <span>
                    {affected}
                    <small>%</small>
                  </span>
                </div>
                <div>
                  <p className="muted">Частка поверхні листка</p>
                  <div className="area-legend">
                    <span>
                      Уражено <b>{affected}%</b>
                    </span>
                    <span>
                      Без ознак <b>{100 - affected}%</b>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {result.predictions.length > 0 && (
            <div className="prediction-chart">
              <h3>Впевненість класифікації</h3>
              <div className="prediction-bar" aria-hidden="true">
                {result.predictions.map((item, index) => (
                  <span
                    key={item.diseaseId}
                    className={`prediction-color-${index}`}
                    style={{ flexGrow: item.score }}
                  />
                ))}
              </div>
              <div className="prediction-legend">
                {result.predictions.map((item, index) => (
                  <div className="prediction-label" key={item.diseaseId}>
                    <i
                      className={`prediction-color-${index}`}
                      aria-hidden="true"
                    />
                    <span>{getDisease(item.diseaseId)?.nameUk}</span>
                    <b>{Math.round(item.score * 100)}%</b>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="analytics-note">
            Приклад звіту: відсотки задані для демонстрації інтерфейсу.
          </p>
        </div>
      </div>
    </section>
  );
}
