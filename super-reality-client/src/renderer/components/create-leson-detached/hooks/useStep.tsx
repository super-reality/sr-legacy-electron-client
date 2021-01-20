import { useMemo } from "react";
import { useSelector } from "react-redux";
import { IStep } from "../../../api/types/step/step";
import { AppState } from "../../../redux/stores/renderer";

export default function useStep(stepId: string | undefined): IStep | null {
  const { treeSteps } = useSelector((state: AppState) => state.createLessonV2);

  const step = useMemo(() => {
    return treeSteps[stepId || ""] || null;
  }, [treeSteps, stepId]);

  return step;
}
