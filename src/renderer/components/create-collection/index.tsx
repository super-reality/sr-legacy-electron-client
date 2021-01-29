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

export default function CreateCollection(): JSX.Element {
  const isEditing = useSelector(
    (state: AppState) => state.createCollection._id !== undefined
  );
  return (
    <>
      <CreateOption data={createOptions[Category.Collection]} />
      <Collapsible
        outer
        expanded
        title={`${isEditing ? "Edit" : "Add"} Collection Info`}
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
      <Collapsible outer expanded title="My Collections" />
      <Collapsible outer expanded title="Chat" />
    </>
  );
}
