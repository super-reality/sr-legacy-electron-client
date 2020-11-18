import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import ipcSend from "../../../utils/ipcSend";
import reduxAction from "../../redux/reduxAction";
import { AppState } from "../../redux/stores/renderer";
import ButtonRound from "../button-round";
import Windowlet from "../create-leson-detached/windowlet";
import Flex from "../flex";
import ChapterView from "./chapter-view";
import ItemPreview from "./item-preview";
import StepView from "./step-view";

import { ReactComponent as ButtonPrev } from "../../../assets/svg/prev-step.svg";
import { ReactComponent as ButtonNext } from "../../../assets/svg/next-step.svg";
import { ReactComponent as ButtonPlay } from "../../../assets/svg/play.svg";
import { ReactComponent as ButtonStop } from "../../../assets/svg/stop.svg";

interface LessonPlayerProps {
  lessonId: string;
  onFinish: () => void;
}

export default function LessonPlayer(props: LessonPlayerProps) {
  const { lessonId, onFinish } = props;
  const dispatch = useDispatch();
  const {
    currentStep,
    currentItem,
    treeAnchors,
    treeSteps,
    treeChapters,
    treeLessons,
    previewOne,
    itemPreview,
    stepPreview,
    chapterPreview,
  } = useSelector((state: AppState) => state.createLessonV2);

  const { playingStepNumber, playingChapterNumber, playing } = useSelector(
    (state: AppState) => state.lessonPlayer
  );
  const { cvResult } = useSelector((state: AppState) => state.render);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [timeTick, setTimeTick] = useState(0);

  const lesson = useMemo(() => (lessonId ? treeLessons[lessonId] : undefined), [
    lessonId,
    treeLessons,
  ]);

  const chapter = useMemo(() => {
    const chapterIdName = lesson?.chapters[playingChapterNumber];
    return chapterIdName ? treeChapters[chapterIdName._id] : undefined;
  }, [playingChapterNumber, treeChapters]);

  const step = useMemo(() => {
    const stepIdName = chapter?.steps[playingStepNumber];
    return stepIdName ? treeSteps[stepIdName._id] : undefined;
  }, [playingStepNumber, treeSteps]);

  // Get step's anchor or just the one in use
  const anchor = useMemo(() => {
    const anchorId = step?.anchor;
    return anchorId ? treeAnchors[anchorId] : undefined;
  }, [step, treeAnchors]);

  const clearPreviews = useCallback(() => {
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: {
        lessonPreview: false,
        chapterPreview: false,
        stepPreview: false,
        itemPreview: false,
      },
    });
    onFinish();
  }, [dispatch, onFinish]);

  const updateCv = useCallback(() => {
    if (anchor) {
      ipcSend({
        method: "cv",
        arg: {
          ...anchor,
          anchorId: anchor._id,
          // cvMatchValue: 0,
          cvTemplates: anchor.templates,
          cvTo: "LESSON_CREATE",
        },
        to: "background",
      });
    }
  }, [anchor]);

  useEffect(() => {
    if (playing) {
      updateCv();
    }
  }, [playing, timeTick, updateCv]);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setTimeTick(new Date().getTime());
    }, anchor?.cvDelay || 500);
  }, [timeoutRef, anchor, cvResult]);

  const doPrev = useCallback(() => {
    if (playingStepNumber > 0) {
      reduxAction(dispatch, {
        type: "SET_LESSON_PLAYER_DATA",
        arg: {
          playingStepNumber: playingStepNumber - 1,
        },
      });
    }
  }, [dispatch, playingStepNumber]);

  const doNext = useCallback(() => {
    if (chapter) {
      if (playingStepNumber + 1 < chapter.steps.length) {
        reduxAction(dispatch, {
          type: "SET_LESSON_PLAYER_DATA",
          arg: {
            playingStepNumber: playingStepNumber + 1,
          },
        });
      } else if (lesson && playingChapterNumber + 1 < lesson.chapters.length) {
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
  }, [dispatch, onFinish, chapter, playingStepNumber, playingChapterNumber]);

  const doPlay = useCallback(
    (play: boolean) => {
      reduxAction(dispatch, {
        type: "SET_LESSON_PLAYING",
        arg: play,
      });
    },
    [dispatch]
  );

  useEffect(() => {
    doPlay(true);
    // hacky hack ahead!
    // First CV find target against a video stream source always fails, I set some
    // timeout to pretend we send one then stop, and set again, since we rely on
    // the CV find result to continue with the loop.
    setTimeout(() => doPlay(false), 100);
    setTimeout(() => doPlay(true), 2000);
  }, [doPlay]);

  return (
    <>
      {playing && itemPreview && previewOne && currentStep && currentItem && (
        <ItemPreview
          showAnchor={false}
          stepId={currentStep}
          itemId={currentItem}
          onSucess={onFinish}
        />
      )}
      {playing && stepPreview && previewOne && step && (
        <StepView stepId={step?._id} onSucess={onFinish} />
      )}
      {playing && chapterPreview && previewOne && chapter && (
        <ChapterView chapterId={chapter._id} onSucess={onFinish} />
      )}
      {playing && chapter && !previewOne && (
        <ChapterView chapterId={chapter?._id} onSucess={doNext} />
      )}
      <Windowlet
        title="Super Reality"
        width={320}
        height={140}
        onClose={clearPreviews}
      >
        <Flex column style={{ height: "100%" }}>
          {!previewOne && chapter && step && (
            <>
              <Flex style={{ margin: "auto" }}>{chapter.name}</Flex>
              <Flex style={{ margin: "auto" }}>step: {step.name}</Flex>
            </>
          )}
          {stepPreview && previewOne && step && (
            <Flex style={{ margin: "auto" }}>{step.name}</Flex>
          )}
          {chapterPreview && previewOne && chapter && (
            <Flex style={{ margin: "auto" }}>{chapter.name}</Flex>
          )}
          <Flex style={{ margin: "auto" }}>
            <ButtonRound
              width="36px"
              height="36px"
              style={{ margin: "8px" }}
              svg={ButtonPrev}
              onClick={doPrev}
            />
            <ButtonRound
              width="36px"
              height="36px"
              style={{ margin: "8px" }}
              svg={ButtonNext}
              onClick={doNext}
            />
            <ButtonRound
              width="36px"
              height="36px"
              style={{ margin: "8px" }}
              svg={playing ? ButtonStop : ButtonPlay}
              onClick={() => doPlay(!playing)}
            />
          </Flex>
        </Flex>
      </Windowlet>
    </>
  );
}
