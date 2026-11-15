import { describe, expect, it } from "vitest";
import { analysisSchema, errorText } from "./wheat";
import { analyzePhoto } from "../services/analysisService";

describe("контракт результату", () => {
  const valid = {
    provider: "demo",
    outcome: "suspected_disease",
    affectedAreaPercent: 28,
    predictions: [{ diseaseId: "brown_rust", score: 0.76 }],
  };
  it.each([-1, 101, NaN])(
    "відхиляє некоректну площу %s",
    (affectedAreaPercent) => {
      expect(
        analysisSchema.safeParse({ ...valid, affectedAreaPercent }).success,
      ).toBe(false);
    },
  );
  it.each([-0.1, 1.1, NaN])("відхиляє некоректну оцінку %s", (score) => {
    expect(
      analysisSchema.safeParse({
        ...valid,
        predictions: [{ diseaseId: "brown_rust", score }],
      }).success,
    ).toBe(false);
  });
  it("відхиляє невідомий ідентифікатор", () => {
    expect(
      analysisSchema.safeParse({
        ...valid,
        predictions: [{ diseaseId: "unknown", score: 0.5 }],
      }).success,
    ).toBe(false);
  });
  it("пояснює структурну помилку", () => {
    const result = analysisSchema.safeParse({ ...valid, predictions: [] });
    if (result.success) throw new Error("Expected invalid fixture");
    expect(errorText(result.error)).toContain("Відсутній результат аналізу");
  });
  it("зберігає повідомлення помилки та має резервний текст", () => {
    expect(errorText(new Error("Мережа недоступна"))).toBe("Мережа недоступна");
    expect(errorText(null)).toBe("Не вдалося виконати дію. Спробуйте ще раз.");
  });
  it("не запускає вже скасовану операцію", async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(
      analyzePhoto(new Blob(), "suspected_disease", controller.signal),
    ).rejects.toMatchObject({ name: "AbortError" });
  });
});
