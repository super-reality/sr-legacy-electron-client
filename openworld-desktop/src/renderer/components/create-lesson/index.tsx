import React from "react";
import "./index.scss";
import "../containers.scss";
import "../lesson.scss";
import Collapsible from "../collapsible";
import MediaAuthoring from "../authoring-media";
import RulesAuthoring from "../authoring-rules";
import InfoAuthoring from "../authoring-info";
import StepAuthoring from "../authoring-step";
import PublishAuthoring from "../authoring-publish";
import StepsView from "../steps-view";
import { mockLessonData } from "../../../__mocks__/mocks";

export default function CreateLesson(): JSX.Element {
  const data = mockLessonData;

  return (
    <>
      <Collapsible outer expanded title="Create Teacher Bot Lesson">
        <div className="mid">
          <Collapsible expanded title="Info">
            <InfoAuthoring />
          </Collapsible>
          <Collapsible expanded title="Media">
            <MediaAuthoring />
          </Collapsible>
          <Collapsible expanded title="Rules">
            <RulesAuthoring />
          </Collapsible>
          <Collapsible expanded title="Publish">
            <PublishAuthoring />
          </Collapsible>
        </div>
      </Collapsible>
      <Collapsible outer expanded title="Create Lesson Step">
        <div className="mid">
          <StepAuthoring />
        </div>
      </Collapsible>
      <Collapsible outer expanded title="Created Steps">
        <StepsView steps={data.steps} />
      </Collapsible>
    </>
  );
}
