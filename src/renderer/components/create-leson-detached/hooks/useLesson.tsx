import { useMemo } from "react";
import { useSelector } from "react-redux";
import { ILessonV2 } from "../../../api/types/lesson-v2/lesson";
import { AppState } from "../../../redux/stores/renderer";

export default function useLesson(
  lessonId: string | undefined
): ILessonV2 | null {
  const { treeLessons } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  const lesson = useMemo(() => {
    return treeLessons[lessonId || ""] || null;
  }, [treeLessons, lessonId]);

  return lesson;
}
