import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import usePopupInput from "../../../hooks/usePopupInput";
import { TreeTypes } from "../../../redux/slices/createLessonSliceV2";
import store, { AppState } from "../../../redux/stores/renderer";
import ButtonRound from "../../button-round";
import Flex from "../../flex";
import newChapter from "../lesson-utils/newChapter";
import newStep from "../lesson-utils/newStep";

import { ReactComponent as IconAddFolder } from "../../../../assets/svg/add-folder.svg";
import { ReactComponent as IconAddShare } from "../../../../assets/svg/add-share.svg";
import { ReactComponent as IconAddFX } from "../../../../assets/svg/new-fx-icon.svg";
import { ReactComponent as IconAddTTS } from "../../../../assets/svg/add-tts.svg";
import { ReactComponent as IconAddAudio } from "../../../../assets/svg/add-audio.svg";
import { ReactComponent as IconAddDialog } from "../../../../assets/svg/add-dialog.svg";
import { ReactComponent as IconAddFocus } from "../../../../assets/svg/add-focus.svg";
import { ReactComponent as IconAddImage } from "../../../../assets/svg/add-image.svg";
import { ReactComponent as IconAddVideo } from "../../../../assets/svg/add-video.svg";
import { BaseItemType, ItemFX } from "../../../api/types/item/item";
import newItem from "../lesson-utils/newItem";
import reduxAction from "../../../redux/reduxAction";

export default function LessonTreeControls() {
  const dispatch = useDispatch();
  const { treeCurrentType, treeCurrentId } = useSelector(
    (state: AppState) => state.createLessonV2
  );
  const { treeSteps } = useSelector((state: AppState) => state.createLessonV2);

  let childType: TreeTypes = "chapter";
  if (treeCurrentType == "chapter") childType = "step";
  if (treeCurrentType == "step") childType = "item";

  const doAddFolder = useCallback(
    (name: string) => {
      // Create chapter
      if (childType == "chapter") {
        newChapter(name, treeCurrentId);
      }
      // Create step
      if (childType == "step") {
        newStep({ name }, treeCurrentId);
      }
    },
    [treeCurrentType, treeCurrentId, dispatch]
  );

  const doAddItem = useCallback(
    (type: BaseItemType) => {
      if (treeCurrentType == "step") {
        newItem(type, treeCurrentId);
      }
    },
    [treeCurrentType, treeCurrentId]
  );

  const [FolderInput, openNewFolderInput] = usePopupInput(
    `Enter new ${childType} name:`,
    doAddFolder
  );

  return (
    <Flex style={{ margin: "8px 0" }}>
      <FolderInput />
      {treeCurrentType == "lesson" || treeCurrentType == "chapter" ? (
        <ButtonRound
          onClick={openNewFolderInput}
          svg={IconAddFolder}
          width="32px"
          height="32px"
        />
      ) : (
        <>
          <ButtonRound
            onClick={() => doAddItem("focus_highlight")}
            svg={IconAddFocus}
            width="32px"
            height="32px"
            style={{ margin: "0 4px" }}
          />
          <ButtonRound
            onClick={() => doAddItem("focus_highlight")}
            svg={IconAddTTS}
            width="32px"
            height="32px"
            style={{ margin: "0 4px" }}
          />
          <ButtonRound
            onClick={() => doAddItem("image")}
            svg={IconAddImage}
            width="32px"
            height="32px"
            style={{ margin: "0 4px" }}
          />
          <ButtonRound
            onClick={() => doAddItem("video")}
            svg={IconAddVideo}
            width="32px"
            height="32px"
            style={{ margin: "0 4px" }}
          />
          <ButtonRound
            onClick={() => doAddItem("fx")}
            svg={IconAddFX}
            width="32px"
            height="32px"
            style={{ margin: "0 4px" }}
          />
          <ButtonRound
            onClick={() => doAddItem("audio")}
            svg={IconAddAudio}
            width="32px"
            height="32px"
            style={{ margin: "0 4px" }}
          />
          <ButtonRound
            onClick={() => doAddItem("dialog")}
            svg={IconAddDialog}
            width="32px"
            height="32px"
            style={{ margin: "0 4px" }}
          />
          <ButtonRound
            onClick={() => doAddItem("focus_highlight")}
            svg={IconAddShare}
            width="32px"
            height="32px"
            style={{ margin: "0 0 0 4px" }}
          />
        </>
      )}
    </Flex>
  );
}
