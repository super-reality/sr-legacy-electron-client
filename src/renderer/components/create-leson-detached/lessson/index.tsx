import { useSelector } from "react-redux";
import "../../containers.scss";
import "./index.scss";
import LessonTree from "../lesson-tree";

import { AppState } from "../../../redux/stores/renderer";
import OpenItem from "../open-item";
import OpenStep from "../open-step";
import LessonTreeControls from "../lesson-tree-controls";
import OpenChapter from "../open-chapter";

export default function Lesson(): JSX.Element {
  const { treeCurrentType, treeCurrentId } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  return (
    <>
      <div className="tree-container">
        <LessonTree />
      </div>
      <div className="create-lesson-item-container shadow-blue mid-tight">
        <LessonTreeControls />
      </div>
      <div className="steps-btn-container">
        {treeCurrentType == "item" && <OpenItem id={treeCurrentId} />}
        {treeCurrentType == "step" && <OpenStep />}
        {treeCurrentType == "chapter" && <OpenChapter />}
      </div>
    </>
  );
}
