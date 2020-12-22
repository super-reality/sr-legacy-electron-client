import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import usePopupInput from "../../../hooks/usePopupInput";
import { AppState } from "../../../redux/stores/renderer";
import ButtonRound from "../../button-round";
import Flex from "../../flex";
import newChapter from "../lesson-utils/newChapter";
import newStep from "../lesson-utils/newStep";

import { BaseItemType, Item } from "../../../items/item";
import newItem from "../lesson-utils/newItem";
import ButtonSimple from "../../button-simple";
import itemsDatabase from "../../../items/itemsDatabase";

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
          {Object.keys(itemsDatabase).map((k) => {
            const type = k as Item["type"];
            return (
              <ButtonRound
                key={`item-add-${type}`}
                onClick={() => doAddItem(type)}
                svg={itemsDatabase[type].icon}
                width="32px"
                height="32px"
                style={{ margin: "0" }}
              />
            );
          })}
        </>
      )}
    </Flex>
  );
}
