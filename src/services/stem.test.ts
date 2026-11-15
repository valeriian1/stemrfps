import { describe, expect, it } from "vitest";
import { analysisSchema } from "../domain/wheat";
import { analyzePhoto } from "./analysisService";
import { validatePhotoFile, MAX_FILE_SIZE } from "./photoService";

describe("мінімальний STEM-фронтенд", () => {
  it.each(["suspected_disease", "no_visible_signs", "inconclusive"] as const)(
    "повертає явний демонстраційний результат %s",
    async (scenario) => {
      const result = await analyzePhoto(
        new Blob(["fixture"]),
        scenario,
        new AbortController().signal,
      );
      expect(result.provider).toBe("demo");
      expect(result.outcome).toBe(scenario);
      expect(result.predictions).toHaveLength(
        scenario === "suspected_disease" ? 3 : 0,
      );
    },
  );
  it("повідомляє про помилку замість вигаданого діагнозу", async () => {
    await expect(
      analyzePhoto(new Blob(), "error", new AbortController().signal),
    ).rejects.toThrow("Демонстраційна помилка");
  });
  it("не повертає застарілий результат після скасування", async () => {
    const controller = new AbortController();
    const result = analyzePhoto(new Blob(), "inconclusive", controller.signal);
    const assertion = expect(result).rejects.toMatchObject({
      name: "AbortError",
    });
    controller.abort();
    await assertion;
  });
  it("відхиляє порожні, надмірні й непідтримувані файли", () => {
    for (const file of [
      new File([], "empty.png", { type: "image/png" }),
      new File(["text"], "a.txt", { type: "text/plain" }),
      new File([new Uint8Array(MAX_FILE_SIZE + 1)], "big.png", {
        type: "image/png",
      }),
    ])
      expect(() => validatePhotoFile(file)).toThrow();
    expect(() =>
      validatePhotoFile(new File(["fixture"], "a.png", { type: "image/png" })),
    ).not.toThrow();
  });
  it("відхиляє припущення без результатів", () => {
    expect(
      analysisSchema.safeParse({
        outcome: "suspected_disease",
        provider: "demo",
        predictions: [],
      }).success,
    ).toBe(false);
  });
});
