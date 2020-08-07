import React from 'react';
import "./index.scss";
import { ILessonData } from '../../../types/teach';
import DescAuthoring from "../authoring-desc";
import Collapsible from '../collapsible';
import PlaceAuthoring from '../authoring-place';
import StepAuthoring from '../authoring-step';
import StepsView from "../steps-view";

interface LessonProps {
  data: ILessonData;
}

export default function CreateLesson(props: LessonProps): JSX.Element {
  const { data } = props;

  return (
    <div className="lesson-container">
      <div className="lesson-title-container">
        <div className={"lesson-icon"}>{}</div>
        <div >
          <div className="lesson-title">Insert Lesson</div>
        </div>
      </div>
      <Collapsible title="Place">
        <PlaceAuthoring />
      </Collapsible>
      <Collapsible title="Lesson Description">
        <DescAuthoring />
      </Collapsible>
      <Collapsible title="Step Authoring">
        <StepAuthoring />
      </Collapsible>
      <Collapsible title="Previous Steps">
        <StepsView steps={data.steps} />
      </Collapsible>
    </div>
  );
}
