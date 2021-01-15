import { useMemo } from "react";
import { useSelector } from "react-redux";
import { IChapter } from "../../../api/types/chapter/chapter";
import { AppState } from "../../../redux/stores/renderer";

export default function useChapter(
  chapterId: string | undefined
): IChapter | null {
  const { treeChapters } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  const chapter = useMemo(() => {
    return treeChapters[chapterId || ""] || null;
  }, [treeChapters, chapterId]);

  return chapter;
}
