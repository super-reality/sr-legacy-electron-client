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
    currentChapter,
    currentStep,
    treeSteps,
    itemPreview,
    stepPreview,
    chapterPreview,
    previewOne,
  } = useSelector((state: AppState) => state.createLessonV2);
  const { cvResult } = useSelector((state: AppState) => state.render);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [timeTick, setTimeTick] = useState(0);
  const [playing, setPlaying] = useState(false);

  const step = useMemo(
    () => (currentStep ? treeSteps[currentStep] : undefined),
    [currentStep, treeSteps]
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
          cvMatchValue: 0,
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
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [timeoutRef, timeTick, playing, updateCv]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTimeTick(timeTick + 1);
    }, 500);
    timeoutRef.current = timeout;
  }, [cvResult]);

  const doPrev = useCallback(() => {}, []);

  const doNext = useCallback(() => {}, []);

  const doPlay = useCallback(() => {
    setPlaying(true);
  }, []);

  const doStop = useCallback(() => {
    setPlaying(false);
  }, []);

  return (
    <>
      {itemPreview && previewOne && <ItemPreview />}
      {stepPreview && previewOne && currentStep && (
        <StepView stepId={currentStep} onSucess={onFinish} />
      )}
      {chapterPreview && currentChapter && (
        <ChapterView chapterId={currentChapter} onSucess={onFinish} />
      )}
      <Windowlet
        title="Super Reality"
        width={320}
        height={140}
        onClose={clearPreviews}
      >
        <Flex column style={{ height: "100%" }}>
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
              onClick={playing ? doStop : doPlay}
            />
          </Flex>
        </Flex>
      </Windowlet>
    </>
  );
}
