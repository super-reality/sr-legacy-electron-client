import React, { useState } from "react";
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

import { ReactComponent as ItemArea } from "../../../../assets/svg/item-area.svg";
import { ReactComponent as ItemAnchor } from "../../../../assets/svg/item-anchor.svg";
import { ReactComponent as ItemTrigger } from "../../../../assets/svg/item-trigger.svg";

type Sections = "Chapters" | "Anchors" | "Info";
const sections: Sections[] = ["Chapters", "Anchors", "Info"];

type ItemModalOptions = "settings" | "anchors" | "trigger";
const itemModalOptions: ItemModalOptions[] = ["settings", "anchors", "trigger"];

function OpenItem() {
  const [view, setView] = useState<string>(itemModalOptions[0]);

  return (
    <Flex
      column
      style={{
        width: "auto",
        height: "200px",
        borderRadius: "4px",
      }}
    >
      <ModalButtons
        buttons={sections}
        initial={view}
        callback={setView}
        style={{ width: "-webkit-fill-available", height: "41px" }}
        icons={[ItemArea, ItemAnchor, ItemTrigger]}
      />
      <Flex column style={{ overflow: "auto" }} />
    </Flex>
  );
}

export default function Lesson(): JSX.Element {
  const [view, setView] = useState<Sections>(sections[0]);

  return (
    <Flex column style={{ height: "100%", width: "-webkit-fill-available" }}>
      <div className="mid-tight">Lesson Name</div>
      <div className="create-lesson-main-container mid-tight">
        <ModalButtons buttons={sections} initial={view} callback={setView} />
        <LessonTree />
      </div>
      <div className="create-lesson-item-container mid-tight">
        <OpenItem />
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
    </Flex>
  );
}
