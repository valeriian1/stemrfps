import {
  analysisSchema,
  type AnalysisResult,
  type DemoScenario,
} from "../domain/wheat";

// Імітація асинхронного запиту до сервісу аналізу.
export async function analyzePhoto(
  _photo: Blob,
  scenario: DemoScenario,
  signal: AbortSignal,
): Promise<AnalysisResult> {
  signal.throwIfAborted();
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", cancel);
      resolve();
    }, 2000);
    function cancel() {
      clearTimeout(timer);
      reject(new DOMException("Скасовано", "AbortError"));
    }
    signal.addEventListener("abort", cancel, { once: true });
  });
  signal.throwIfAborted();
  if (scenario === "error")
    throw new Error(
      "Демонстраційна помилка аналізу. Оберіть інший сценарій і повторіть.",
    );
  return analysisSchema.parse({
    outcome: scenario,
    provider: "demo",
    affectedAreaPercent: scenario === "suspected_disease" ? 28 : undefined,
    predictions:
      scenario === "suspected_disease"
        ? [
            { diseaseId: "brown_rust", score: 0.76 },
            { diseaseId: "yellow_rust", score: 0.16 },
            { diseaseId: "septoria", score: 0.08 },
          ]
        : [],
  });
}
