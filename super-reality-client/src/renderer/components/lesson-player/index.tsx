import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ipcSend from "../../../utils/ipcSend";
import reduxAction from "../../redux/reduxAction";
import { AppState } from "../../redux/stores/renderer";
import ButtonSimple from "../button-simple";
import Windowlet from "../create-leson-detached/windowlet";
import Flex from "../flex";
import ChapterView from "./chapter-view";
import ItemPreview from "./item-preview";
import StepView from "./step-view";

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
          <ButtonSimple
            width="200px"
            height="24px"
            margin="auto"
            onClick={updateCv}
          >
            Find Anchor
          </ButtonSimple>
        </Flex>
      </Windowlet>
    </>
  );
}
