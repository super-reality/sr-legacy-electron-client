import React from 'react';
import "./index.scss";
import { LessonData } from '../../../types/teach';
import DescAuthoring from "./desc-authoring";
import Collapsible from '../collapsible';
import PlaceAuthoring from './place-authoring';

interface LessonProps {
  data: LessonData;
}

export default function Lesson(props: LessonProps): JSX.Element {
  const { } = props;

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
    </div>
  );
}
