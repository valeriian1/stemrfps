import { useOutletContext } from "react-router-dom";
import type { AnalysisResult } from "../domain/wheat";

export type AnalysisDraft = { photo: Blob; result: AnalysisResult };

export function useAnalysisDraft() {
  return useOutletContext<{
    draft: AnalysisDraft | null;
    setDraft: (draft: AnalysisDraft | null) => void;
  }>();
}
