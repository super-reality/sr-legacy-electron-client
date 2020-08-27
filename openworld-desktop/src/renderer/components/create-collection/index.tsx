import React from "react";
import "../containers.scss";
import "../lesson.scss";
import Collapsible from "../collapsible";
import MediaAuthoring from "./authoring-media";
import InfoAuthoring from "./authoring-info";
import PublishAuthoring from "./authoring-publish";
import createOptions from "../../views/create/components";
import CreateOption from "../create-option";
import Category from "../../../types/collections";

export default function CreateCollection(): JSX.Element {
  return (
    <>
      <CreateOption data={createOptions[Category.Collection]} />
      <Collapsible outer expanded title="Add Collection Info">
        <div className="mid">
          <Collapsible expanded title="Info">
            <InfoAuthoring />
          </Collapsible>
          <Collapsible expanded title="Media">
            <MediaAuthoring />
          </Collapsible>
          <Collapsible expanded title="Publish">
            <PublishAuthoring />
          </Collapsible>
        </div>
      </Collapsible>
      <Collapsible outer expanded title="My Collections" />
      <Collapsible outer expanded title="Chat" />
    </>
  );
}
