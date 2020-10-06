import React, { useState } from "react";
import { useSelector } from "react-redux";
import Flex from "../../flex";
import ModalButtons from "../modal-buttons";
import "../../containers.scss";
import "./index.scss";
import ButtonRound from "../../button-round";
import LessonTree from "../lesson-tree";
import { ReactComponent as ButtonPrev } from "../../../../assets/svg/prev.svg";
import { ReactComponent as ButtonNext } from "../../../../assets/svg/next.svg";
import { ReactComponent as ButtonPlay } from "../../../../assets/svg/play.svg";
import { ReactComponent as ButtonFolder } from "../../../../assets/svg/folder.svg";
import { ReactComponent as ButtonCopy } from "../../../../assets/svg/copy.svg";
import { ReactComponent as ButtonPaste } from "../../../../assets/svg/paste.svg";
import { ReactComponent as ButtonCut } from "../../../../assets/svg/cut.svg";
import { AppState } from "../../../redux/stores/renderer";
import OpenItem from "../open-item";

type Sections = "Chapters" | "Anchors" | "Info";
const sections: Sections[] = ["Chapters", "Anchors", "Info"];

export default function Lesson(): JSX.Element {
  const [view, setView] = useState<Sections>(sections[0]);
  const { treeCurrentType, treeCurrentId } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  return (
    <>
      <div className="mid-tight">Lesson Name</div>
      <div className="create-lesson-main-container mid-tight">
        <ModalButtons buttons={sections} initial={view} callback={setView} />
        <LessonTree />
      </div>
      <div className="create-lesson-item-container mid-tight">
        {treeCurrentType == "item" && <OpenItem id={treeCurrentId} />}
        <Flex style={{ marginTop: "auto" }}>
          <ButtonRound
            width="36px"
            height="36px"
            onClick={() => {}}
            svg={ButtonPrev}
            style={{ marginRight: "8px" }}
          />
          <ButtonRound
            width="36px"
            height="36px"
            iconFill="var(--color-green)"
            onClick={() => {}}
            svg={ButtonPlay}
            style={{ marginRight: "8px" }}
          />
          <ButtonRound
            width="36px"
            height="36px"
            onClick={() => {}}
            svg={ButtonNext}
            style={{ marginRight: "8px" }}
          />
          <ButtonRound
            width="36px"
            height="36px"
            onClick={() => {}}
            svg={ButtonFolder}
            style={{ marginLeft: "auto" }}
          />
          <ButtonRound
            width="36px"
            height="36px"
            onClick={() => {}}
            svg={ButtonCopy}
            style={{ marginLeft: "8px" }}
          />
          <ButtonRound
            width="36px"
            height="36px"
            onClick={() => {}}
            svg={ButtonPaste}
            style={{ marginLeft: "8px" }}
          />
          <ButtonRound
            width="36px"
            height="36px"
            onClick={() => {}}
            svg={ButtonCut}
            style={{ marginLeft: "8px" }}
          />
        </Flex>
      </div>
    </>
  );
}
