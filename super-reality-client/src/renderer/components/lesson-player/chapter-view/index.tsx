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

  const chapter: IChapter | undefined = useMemo(
    () => treeChapters[chapterId] || undefined,
    [treeChapters, chapterId]
  );

  const [currentStepId, setCurrentStepId] = useState(defaultStep);
  const [currentStep, setCurrentStep] = useState(
    defaultStep && chapter
      ? chapter.steps.findIndex((s) => defaultStep == s._id)
      : 0
  );
  console.log(chapter, currentStepId, currentStep);

  const doNextStep = useCallback(() => {
    if (currentStep + 1 > chapter.steps.length) {
      onSucess();
    } else {
      setCurrentStep(currentStep + 1);
    }
  }, [chapter, currentStep]);

  useEffect(() => {
    const stepId = chapter.steps[currentStep]._id;
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: {
        currentStep: stepId,
      },
    });
    setCurrentStepId(stepId);
  }, [dispatch, currentStep]);

  return currentStepId ? (
    <StepView stepId={currentStepId} onSucess={doNextStep} />
  ) : (
    <></>
  );
}
