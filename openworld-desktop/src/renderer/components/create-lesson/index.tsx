import React from "react";
import "./index.scss";
import "../containers.scss";
import "../lesson.scss";
import DescAuthoring from "../authoring-desc";
import Collapsible from "../collapsible";
import PlaceAuthoring from "../authoring-place";
import StepAuthoring from "../authoring-step";
import StepsView from "../steps-view";
import { mockLessonData } from "../../../__mocks__/mocks";

export default function CreateLesson(): JSX.Element {
  const data = mockLessonData;

  return (
    <div className="mid">
      <div className="container-title">Create Lesson</div>
      <Collapsible expanded title="Place">
        <PlaceAuthoring />
      </Collapsible>
      <Collapsible expanded title="Lesson Description">
        <DescAuthoring />
      </Collapsible>
      <Collapsible expanded title="Step Authoring">
        <StepAuthoring />
      </Collapsible>
      <Collapsible expanded title="Previous Steps">
        <StepsView steps={data.steps} />
      </Collapsible>
    </div>
  );
}
