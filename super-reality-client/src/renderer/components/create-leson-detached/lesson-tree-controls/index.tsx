import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import usePopupInput from "../../../hooks/usePopupInput";
import { TreeTypes } from "../../../redux/slices/createLessonSliceV2";
import { AppState } from "../../../redux/stores/renderer";
import ButtonRound from "../../button-round";
import Flex from "../../flex";
import newChapter from "../lesson-utils/newChapter";
import newStep from "../lesson-utils/newStep";

import { ReactComponent as IconAddShare } from "../../../../assets/svg/add-share.svg";
import { ReactComponent as IconAddTeach } from "../../../../assets/svg/add-teach.svg";
import { ReactComponent as IconAddTTS } from "../../../../assets/svg/add-tts.svg";
import { ReactComponent as IconAddAudio } from "../../../../assets/svg/add-audio.svg";
import { ReactComponent as IconAddDialog } from "../../../../assets/svg/add-dialog.svg";
import { ReactComponent as IconAddFocus } from "../../../../assets/svg/add-focus.svg";
import { ReactComponent as IconAddImage } from "../../../../assets/svg/add-image.svg";
import { ReactComponent as IconAddVideo } from "../../../../assets/svg/add-video.svg";
import { BaseItemType } from "../../../api/types/item/item";
import newItem from "../lesson-utils/newItem";
import ButtonSimple from "../../button-simple";

export default function LessonTreeControls() {
  const dispatch = useDispatch();
  const {
    treeCurrentType,
    treeCurrentId,
    currentLesson,
    currentChapter,
  } = useSelector((state: AppState) => state.createLessonV2);

  let childType: TreeTypes = "chapter";
  if (treeCurrentType == "chapter") childType = "step";
  if (treeCurrentType == "step") childType = "item";

  const doAddStep = useCallback(
    (name: string) => newStep({ name }, currentChapter),
    [currentChapter, dispatch]
  );

  const doAddChapter = useCallback(
    (name: string) => newChapter(name, currentLesson),
    [currentLesson, dispatch]
  );

  const doAddItem = useCallback(
    (type: BaseItemType) => {
      if (treeCurrentType == "step") {
        newItem(type, treeCurrentId);
      }
    },
    [treeCurrentType, treeCurrentId]
  );

  const [ChapterInput, openNewChapterInput] = usePopupInput(
    `Enter new chapter name:`,
    doAddChapter
  );

  const [StepInput, openNewStepInput] = usePopupInput(
    `Enter new step name:`,
    doAddStep
  );

  return (
    <Flex style={{ margin: "8px 0" }}>
      <ChapterInput />
      <StepInput />
      {treeCurrentType == "lesson" || treeCurrentType == "chapter" ? (
        <>
          <ButtonSimple
            onClick={openNewChapterInput}
            width="170px"
            height="24px"
            margin="auto 4px auto auto"
          >
            New Chapter
          </ButtonSimple>
          <ButtonSimple
            onClick={openNewStepInput}
            width="170px"
            height="24px"
            margin="auto auto auto 4px"
          >
            New Step
          </ButtonSimple>
        </>
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
            onClick={() => doAddItem("focus_highlight")}
            svg={IconAddTeach}
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
