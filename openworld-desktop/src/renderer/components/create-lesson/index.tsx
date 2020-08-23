import React from "react";
import "./index.scss";
import "../containers.scss";
import "../lesson.scss";
import Collapsible from "../collapsible";
import MediaAuthoring from "../authoring-media";
import InfoAuthoring from "../authoring-info";
import StepAuthoring from "../authoring-step";
import PublishAuthoring from "../authoring-publish";
import StepsView from "../steps-view";
import createOptions from "../../views/create/components";
import CreateOption from "../create-option";
import Category from "../../../types/collections";

export default function CreateLesson(): JSX.Element {
  return (
    <>
      <CreateOption data={createOptions[Category.Lesson]} />
      <Collapsible outer expanded title="Add Lesson Info">
        <div className="mid">
          <Collapsible expanded title="Info">
            <InfoAuthoring />
          </Collapsible>
          <Collapsible expanded title="Media">
            <MediaAuthoring />
          </Collapsible>
        </div>
      </Collapsible>
      <Collapsible outer expanded title="Add Lesson Step">
        <div className="mid">
          <StepAuthoring />
        </div>
      </Collapsible>
      <Collapsible outer expanded title="Publish Entire Lesson">
        <div className="mid">
          <PublishAuthoring />
        </div>
      </Collapsible>
      <Collapsible outer expanded title="Created Steps">
        <StepsView />
      </Collapsible>
    </>
  );
}
