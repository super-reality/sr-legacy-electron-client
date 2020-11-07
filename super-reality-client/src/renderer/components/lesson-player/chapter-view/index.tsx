import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IChapter } from "../../../api/types/chapter/chapter";
import reduxAction from "../../../redux/reduxAction";
import { AppState } from "../../../redux/stores/renderer";
import StepView from "../step-view";

interface ChapterViewProps {
  chapterId: string;
  defaultStep?: string;
  onSucess: () => void;
}

export default function ChapterView(props: ChapterViewProps) {
  const { onSucess, defaultStep, chapterId } = props;
  const dispatch = useDispatch();
  const { treeChapters } = useSelector(
    (state: AppState) => state.createLessonV2
  );
  const { playingStepNumber } = useSelector(
    (state: AppState) => state.lessonPlayer
  );

  const chapter: IChapter | undefined = useMemo(
    () => treeChapters[chapterId] || undefined,
    [treeChapters, chapterId]
  );

  const [currentStepId, setCurrentStepId] = useState(defaultStep);

  const setCurrentStep = useCallback(
    (i: number) => {
      reduxAction(dispatch, {
        type: "SET_LESSON_PLAYER_DATA",
        arg: {
          playingStepNumber: i,
        },
      });
    },
    [dispatch]
  );

  const doNextStep = useCallback(() => {
    if (playingStepNumber + 1 >= chapter.steps.length) {
      onSucess();
    } else {
      setCurrentStep(playingStepNumber + 1);
    }
  }, [chapter, playingStepNumber]);

  useEffect(() => {
    const stepId = chapter.steps[playingStepNumber]._id;
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: {
        currentStep: stepId,
      },
    });
    setCurrentStepId(stepId);
  }, [dispatch, playingStepNumber]);

  return currentStepId ? (
    <StepView stepId={currentStepId} onSucess={doNextStep} />
  ) : (
    <></>
  );
}
