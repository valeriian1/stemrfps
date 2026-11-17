import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { analyzePhoto } from "../services/analysisService";
import { preparePhoto } from "../services/photoService";
import { errorText, type AnalysisResult } from "../domain/wheat";
import { ErrorNotice, useBlobUrl } from "../components/WheatUI";
import AnalysisResultView from "../components/AnalysisResultView";

export default function AnalyzePage() {
  const [photo, setPhoto] = useState<Blob | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [state, setState] = useState<
    "idle" | "validating" | "ready" | "analyzing" | "result" | "error"
  >("idle");
  const [error, setError] = useState("");
  const [tooltipBlocked, setTooltipBlocked] = useState(false);
  const preview = useBlobUrl(photo);
  const operation = useRef(0),
    busy = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  useEffect(
    () => () => {
      operation.current++;
      controller.current?.abort();
    },
    [],
  );
  function resetResult() {
    operation.current++;
    controller.current?.abort();
    busy.current = false;
    setResult(null);
    setError("");
  }
  async function choose(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setTooltipBlocked(true);
    resetResult();
    const current = operation.current;
    setPhoto(null);
    setState("validating");
    try {
      const prepared = await preparePhoto(file);
      if (current === operation.current) {
        setPhoto(prepared);
        setState("ready");
      }
    } catch (e) {
      if (current === operation.current) {
        setError(errorText(e));
        setState("error");
      }
    }
  }
  async function analyze() {
    if (!photo || busy.current) return;
    busy.current = true;
    const current = ++operation.current;
    const abort = new AbortController();
    controller.current = abort;
    setState("analyzing");
    setError("");
    setResult(null);
    try {
      const next = await analyzePhoto(photo, "suspected_disease", abort.signal);
      if (current !== operation.current) return;
      setResult(next);
      setState("result");
      requestAnimationFrame(() => resultRef.current?.focus());
    } catch (e) {
      if (current === operation.current && !abort.signal.aborted) {
        setError(errorText(e));
        setState("error");
      }
    } finally {
      if (current === operation.current) busy.current = false;
    }
  }
  return (
    <div className="page-stack analysis-page">
      <header className="page-heading">
        <h1>Аналіз листя пшениці</h1>
      </header>
      {!result && <div className="analysis-tip">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 3H9c0-1 0-2-1-3Z" />
        </svg>
        <p>
          Додайте чітке фото листка пшениці та натисніть «Здійснити аналіз».
          <br />
          Ви отримаєте короткий звіт з описом ознак і посиланням на статтю
          довідника.
        </p>
      </div>}
      {!result && (
        <section
          className="panel form-stack photo-panel"
          aria-label="Завантаження фото"
        >
          <div className="upload-control">
            <h2 className="upload-heading">Фото листка</h2>
            <label
              className="upload-placeholder upload-target"
              data-tooltip-blocked={tooltipBlocked}
              onPointerLeave={() => setTooltipBlocked(false)}
              onBlur={() => setTooltipBlocked(false)}
            >
              <input
                aria-label="Обрати фото"
                title=" "
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={choose}
                aria-describedby="upload-tip"
              />
              {preview ? (
                <img
                  className="photo-preview"
                  src={preview}
                  alt="Вибране фото для аналізу"
                />
              ) : (
                <>
                  <span className="upload-symbol" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 15V4m-4 4 4-4 4 4M5 15v5h14v-5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>Натисніть, щоб додати фото листка пшениці</span>
                </>
              )}
            </label>
            <span className="upload-tooltip" id="upload-tip" role="tooltip">
              {preview
                ? "Замінити фото"
                : "Оберіть фото JPEG, PNG або WebP до 10 МБ"}
            </span>
          </div>
          {state === "validating" && <p role="status">Підготовка фото…</p>}
          {state === "analyzing" && (
            <p className="analysis-loading" role="status">
              <span className="loading-spinner" aria-hidden="true" />
              Формуємо звіт…
            </p>
          )}
          <div className="actions">
            <button
              className="button primary"
              disabled={
                !photo || state === "analyzing" || state === "validating"
              }
              onClick={() => void analyze()}
            >
              {state === "analyzing" ? "Аналіз триває…" : "Здійснити аналіз"}
            </button>
            {state === "analyzing" && (
              <button
                className="button secondary"
                onClick={() => {
                  resetResult();
                  setState("ready");
                }}
              >
                Скасувати
              </button>
            )}
            {photo && state !== "analyzing" && (
              <button
                className="button secondary"
                onClick={() => {
                  resetResult();
                  setPhoto(null);
                  setState("idle");
                }}
              >
                Прибрати фото
              </button>
            )}
          </div>
        </section>
      )}
      {error && <ErrorNotice>{error}</ErrorNotice>}
      {result && (
        <div className="panel analytics-panel" ref={resultRef} tabIndex={-1}>
          <AnalysisResultView result={result} preview={preview ?? undefined} />
          <div className="actions">
            <button
              className="button primary"
              onClick={() => {
                resetResult();
                setPhoto(null);
                setState("idle");
              }}
            >
              Аналізувати інше фото
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
