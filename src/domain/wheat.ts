import { z } from "zod";

// Keep schema validation compatible with our no-eval Content Security Policy.
z.config({ jitless: true });

export const diseaseIds = [
  "brown_rust",
  "yellow_rust",
  "septoria",
  "powdery_mildew",
] as const;
export const outcomeSchema = z.enum([
  "suspected_disease",
  "no_visible_signs",
  "inconclusive",
]);
export type Outcome = z.infer<typeof outcomeSchema>;
export type DemoScenario = Outcome | "error";
export const outcomeLabels: Record<Outcome, string> = {
  suspected_disease: "Є припущення щодо хвороби",
  no_visible_signs: "Видимих ознак підтримуваних хвороб не виявлено",
  inconclusive: "Не вдалося визначити",
};
export const analysisSchema = z
  .object({
    outcome: outcomeSchema,
    provider: z.literal("demo"),
    affectedAreaPercent: z.number().min(0).max(100).optional(),
    predictions: z
      .array(
        z.object({
          diseaseId: z.enum(diseaseIds),
          score: z.number().min(0).max(1),
        }),
      )
      .max(4),
  })
  .refine(
    (value) =>
      value.outcome !== "suspected_disease" || value.predictions.length > 0,
    "Відсутній результат аналізу",
  );
export type AnalysisResult = z.infer<typeof analysisSchema>;
export interface Disease {
  id:
    | (typeof diseaseIds)[number]
    | "stem_rust"
    | "tan_spot"
    | "fusarium_head_blight"
    | "loose_smut"
    | "eyespot"
    | "take_all";
  nameUk: string;
  scientificName: string;
  summary: string;
  observations: string[];
  symptoms: string;
  generalActions: string;
  sources: { title: string; url: string }[];
}
export function errorText(error: unknown) {
  if (error instanceof z.ZodError)
    return error.issues.map((issue) => issue.message).join(". ");
  return error instanceof Error
    ? error.message
    : "Не вдалося виконати дію. Спробуйте ще раз.";
}
