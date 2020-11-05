import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ipcSend from "../../../utils/ipcSend";
import reduxAction from "../../redux/reduxAction";
import { AppState } from "../../redux/stores/renderer";
import ButtonSimple from "../button-simple";
import Windowlet from "../create-leson-detached/windowlet";
import Flex from "../flex";
import ItemPreview from "./item-preview";
import StepPreview from "./step-preview";

interface LessonPlayerProps {
  onFinish: () => void;
}

export default function LessonPlayer(props: LessonPlayerProps) {
  const { onFinish } = props;
  const dispatch = useDispatch();
  const { currentAnchor, treeAnchors, currentStep, treeSteps } = useSelector(
    (state: AppState) => state.createLessonV2
  );
  const { itemPreview, stepPreview } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  const step = useMemo(
    () => (currentStep ? treeSteps[currentStep] : undefined),
    [currentStep, treeSteps]
  );

  // Get item's anchor or just the one in use
  const anchor = useMemo(() => {
    const anchorId = step?.anchor || currentAnchor;
    return anchorId ? treeAnchors[anchorId] : undefined;
  }, [currentAnchor, treeAnchors]);

  const clearPreviews = useCallback(() => {
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: { stepPreview: false, itemPreview: false, lessonPreview: false },
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
      {itemPreview && <ItemPreview />}
      {stepPreview && <StepPreview onSucess={() => {}} />}
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
