import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import idNamePos from "../../../../utils/idNamePos";
import reduxAction from "../../../redux/reduxAction";
import store, { AppState } from "../../../redux/stores/renderer";

export default function useLessonPreview() {
  const { treeCurrentType } = useSelector(
    (state: AppState) => state.createLessonV2
  );
  const dispatch = useDispatch();

  const doPreviewCurrentToNumber = useCallback(() => {
    const slice = store.getState().createLessonV2;

    const lessonId = slice.currentLesson;
    const chapterId = slice.currentChapter;
    const stepId = slice.currentStep;

    if (lessonId && chapterId && stepId) {
      const lesson = slice.treeLessons[lessonId];
      const chapter = slice.treeChapters[chapterId];
      const chapterPos = lesson ? idNamePos(lesson.chapters, chapterId) : 0;
      const stepPos = chapter ? idNamePos(chapter.steps, stepId) : 0;

      reduxAction(dispatch, {
        type: "SET_LESSON_PLAYER_DATA",
        arg: {
          playingChapterNumber: chapterPos > -1 ? chapterPos : 0,
          playingStepNumber: stepPos > -1 ? stepPos : 0,
        },
      });
    } else if (lessonId && chapterId) {
      const lesson = slice.treeLessons[lessonId];
      const chapterPos = lesson ? idNamePos(lesson.chapters, chapterId) : 0;

      reduxAction(dispatch, {
        type: "SET_LESSON_PLAYER_DATA",
        arg: {
          playingChapterNumber: chapterPos > -1 ? chapterPos : 0,
        },
      });
    }
  }, [dispatch]);

  const doPreview = useCallback(() => {
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: {
        lessonPreview: treeCurrentType == "lesson",
        chapterPreview: treeCurrentType == "chapter",
        stepPreview: treeCurrentType == "step",
        itemPreview: treeCurrentType == "item",
        anchorTestView: false,
        previewing: true,
        previewOne: false,
      },
    });
    doPreviewCurrentToNumber();
  }, [dispatch, treeCurrentType, doPreviewCurrentToNumber]);

  return doPreview;
}
