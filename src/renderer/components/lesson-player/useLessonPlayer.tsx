import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ipcSend from "../../../utils/ipcSend";
import reduxAction from "../../redux/reduxAction";
import store, { AppState } from "../../redux/stores/renderer";
import pendingReduxAction from "../../redux/utils/pendingReduxAction";
import ChapterView from "./chapter-view";

export default function useLessonPlayer(
  lessonId: string
): [JSX.Element, () => void, () => void, (play: boolean) => void, () => void] {
  const dispatch = useDispatch();
  const { treeAnchors, treeSteps, treeChapters, treeLessons } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  const [ticker, setTicker] = useState(0);

  const { playingStepNumber, playingChapterNumber, playing } = useSelector(
    (state: AppState) => state.lessonPlayer
  );

  const lesson = useMemo(() => (lessonId ? treeLessons[lessonId] : undefined), [
    lessonId,
    treeLessons,
  ]);

  const chapter = useMemo(() => {
    const chapterIdName = lesson?.chapters[playingChapterNumber];
    return chapterIdName ? treeChapters[chapterIdName._id] : undefined;
  }, [playingChapterNumber, lesson, treeChapters]);

  const step = useMemo(() => {
    const stepIdName = chapter?.steps[playingStepNumber];
    return stepIdName ? treeSteps[stepIdName._id] : undefined;
  }, [playingStepNumber, chapter, treeSteps]);

  // Get step's anchor or just the one in use
  const anchor = useMemo(() => {
    const anchors =
      step?.startWhen.filter((tv) => tv.type == "Image Found") || [];

    const anchorId = (anchors[0]?.value as string) || null;

    return anchorId ? treeAnchors[anchorId] : undefined;
  }, [step, treeAnchors]);

  const clearCv = useCallback(() => {
    reduxAction(dispatch, {
      type: "SET_CV_RESULT",
      arg: {
        time: new Date().getTime(),
        date: new Date().getTime(),
        id: "",
        dist: 0,
        sizeFactor: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
    });
  }, [dispatch]);

  const onFinish = useCallback(() => {
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: {
        lessonPreview: false,
        chapterPreview: false,
        stepPreview: false,
        itemPreview: false,
        anchorTestView: false,
        previewing: false,
        previewOne: false,
      },
    });
  }, [dispatch]);

  const triggerCvUpdate = useCallback(() => {
    if (anchor) {
      // console.log("useLessonPlayer triggerCvUpdate");
      ipcSend({
        method: "cv",
        arg: {
          ...anchor,
          anchorId: anchor._id,
          // 0 should be used when you want to see the cv regardless of the sucess (debug)
          // cvMatchValue: 0,
          cvTemplates: anchor.templates,
          cvTo: "renderer",
        },
        to: "background",
      });
    }
  }, [anchor]);

  useEffect(() => {
    // console.log("timeTick useEffect: playing? ", playing, ticker);
    if (playing) {
      triggerCvUpdate();
      const prevDate = (store.getState() as AppState).render.cvResult.date;
      pendingReduxAction((state) => state.render.cvResult.date, prevDate, 3000)
        .then((state) => {
          setTicker(state.render.cvResult.date);
        })
        .catch((e) => {
          console.error(e);
          setTicker(new Date().getTime());
        });
    }
  }, [playing, ticker, triggerCvUpdate]);

  const doPrev = useCallback(() => {
    if (playingStepNumber > 0) {
      clearCv();
      reduxAction(dispatch, {
        type: "SET_LESSON_PLAYER_DATA",
        arg: {
          playingStepNumber: playingStepNumber - 1,
        },
      });
    }
  }, [dispatch, clearCv, playingStepNumber]);

  const doNext = useCallback(() => {
    if (chapter) {
      if (playingStepNumber + 1 < chapter.steps.length) {
        clearCv();
        reduxAction(dispatch, {
          type: "SET_LESSON_PLAYER_DATA",
          arg: {
            playingStepNumber: playingStepNumber + 1,
          },
        });
      } else if (lesson && playingChapterNumber + 1 < lesson.chapters.length) {
        clearCv();
        reduxAction(dispatch, {
          type: "SET_LESSON_PLAYER_DATA",
          arg: {
            playingStepNumber: 0,
            playingChapterNumber: playingChapterNumber + 1,
          },
        });
      } else if (lesson && playingChapterNumber + 1 >= lesson.chapters.length) {
        // we reached the end of the lesson, finish it
        onFinish();
      }
    }
  }, [
    dispatch,
    clearCv,
    onFinish,
    chapter,
    playingStepNumber,
    playingChapterNumber,
  ]);

  const doPlay = useCallback(
    (play: boolean) => {
      reduxAction(dispatch, {
        type: "SET_LESSON_PLAYING",
        arg: play,
      });
    },
    [dispatch]
  );

  const Reality =
    playing && chapter ? (
      <ChapterView chapterId={chapter?._id} onSucess={doNext} />
    ) : (
      <></>
    );

  return [Reality, doPrev, doNext, doPlay, onFinish];
}
