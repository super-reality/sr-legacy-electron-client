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
import ButtonSimple from "../button-simple";
import Windowlet from "../create-leson-detached/windowlet";
import Flex from "../flex";
import ChapterView from "./chapter-view";
import ItemPreview from "./item-preview";
import StepView from "./step-view";

import { ReactComponent as ButtonPrev } from "../../../assets/svg/prev-step.svg";
import { ReactComponent as ButtonNext } from "../../../assets/svg/next-step.svg";
import { ReactComponent as ButtonPlay } from "../../../assets/svg/play.svg";
import { ReactComponent as ButtonStop } from "../../../assets/svg/prev.svg";

interface LessonPlayerProps {
  onFinish: () => void;
}

export default function LessonPlayer(props: LessonPlayerProps) {
  const { onFinish } = props;
  const dispatch = useDispatch();
  const {
    currentAnchor,
    treeAnchors,
    treeChapters,
    currentChapter,
    currentStep,
    treeSteps,
    itemPreview,
    stepPreview,
    chapterPreview,
    previewOne,
  } = useSelector((state: AppState) => state.createLessonV2);
  const { playingStepNumber, playingChapterNumber, playing } = useSelector(
    (state: AppState) => state.lessonPlayer
  );
  const { cvResult } = useSelector((state: AppState) => state.render);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [timeTick, setTimeTick] = useState(0);

  const step = useMemo(
    () => (currentStep ? treeSteps[currentStep] : undefined),
    [currentStep, treeSteps]
  );

  const chapter = useMemo(
    () => (currentChapter ? treeChapters[currentChapter] : undefined),
    [currentChapter, treeChapters]
  );

  // Get item's anchor or just the one in use
  const anchor = useMemo(() => {
    const anchorId = step?.anchor || currentAnchor;
    return anchorId ? treeAnchors[anchorId] : undefined;
  }, [step, currentAnchor, treeAnchors]);

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
    reduxAction(dispatch, {
      type: "SET_LESSON_PLAYER_DATA",
      arg: {
        playingStepNumber: playingStepNumber - 1,
      },
    });
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
      } else {
        reduxAction(dispatch, {
          type: "SET_LESSON_PLAYER_DATA",
          arg: {
            playingChapterNumber: playingChapterNumber + 1,
          },
        });
      }
    }
  }, [dispatch, chapter, playingStepNumber, playingChapterNumber]);

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
  }, [doPlay]);

  return (
    <>
      {playing && itemPreview && previewOne && <ItemPreview />}
      {playing && stepPreview && previewOne && currentStep && (
        <StepView stepId={currentStep} onSucess={onFinish} />
      )}
      {playing && chapterPreview && currentChapter && (
        <ChapterView chapterId={currentChapter} onSucess={onFinish} />
      )}
      <Windowlet
        title="Super Reality"
        width={320}
        height={140}
        onClose={clearPreviews}
      >
        <Flex column style={{ height: "100%" }}>
          {stepPreview && currentStep && step && (
            <Flex style={{ margin: "auto" }}>{step.name}</Flex>
          )}
          {chapterPreview && currentChapter && chapter && (
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
              onClick={playing ? () => doPlay(false) : () => doPlay(true)}
            />
          </Flex>
        </Flex>
      </Windowlet>
    </>
  );
}
