import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import usePopupInput from "../../../hooks/usePopupInput";
import { AppState } from "../../../redux/stores/renderer";
import ButtonRound from "../../button-round";
import Flex from "../../flex";
import newChapter from "../lesson-utils/newChapter";
import newStep from "../lesson-utils/newStep";

import { ReactComponent as IconAddFX } from "../../../../assets/svg/new-fx-icon.svg";
import { ReactComponent as IconAddTTS } from "../../../../assets/svg/add-tts.svg";
import { ReactComponent as IconAddSearch } from "../../../../assets/svg/search.svg";
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
    <Flex
      style={{
        margin: "8px auto",
        width: "-webkit-fill-available",
        justifyContent: "space-evenly",
      }}
    >
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
            onClick={() => doAddItem("fx")}
            svg={IconAddFX}
            width="32px"
            height="32px"
            style={{ margin: "0 4px" }}
          />
          <ButtonRound
            onClick={() => doAddItem("audio")}
            svg={IconAddSearch}
            width="32px"
            height="32px"
            style={{ margin: "0 4px" }}
          />
        </>
      )}
    </Flex>
  );
}
