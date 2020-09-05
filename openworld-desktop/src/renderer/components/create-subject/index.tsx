import React from "react";
import "../containers.scss";
import "../lesson.scss";
import { useSelector } from "react-redux";
import Collapsible from "../collapsible";
import MediaAuthoring from "./authoring-media";
import InfoAuthoring from "./authoring-info";
import PublishAuthoring from "./authoring-publish";
import createOptions from "../../views/create/components";
import CreateOption from "../create-option";
import Category from "../../../types/collections";
import { AppState } from "../../redux/stores/renderer";

export default function CreateSubject(): JSX.Element {
  const isEditing = useSelector(
    (state: AppState) => state.createCollection._id !== undefined
  );

  return (
    <>
      <CreateOption data={createOptions[Category.Subject]} />
      <Collapsible
        outer
        expanded
        title={`${isEditing ? "Edit" : "Add"} Subject Info`}
      >
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
      <Collapsible outer expanded title="My Subjects" />
      <Collapsible outer expanded title="Chat" />
    </>
  );
}
