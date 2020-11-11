import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Flex from "../../flex";
import "../../containers.scss";
import "./index.scss";
import ButtonRound from "../../button-round";
import LessonTree from "../lesson-tree";
import { ReactComponent as ButtonPrev } from "../../../../assets/svg/prev-step.svg";
import { ReactComponent as ButtonNext } from "../../../../assets/svg/next-step.svg";
import { ReactComponent as ButtonPlay } from "../../../../assets/svg/play.svg";

import { ReactComponent as ButtonFolder } from "../../../../assets/svg/folder.svg";
import { ReactComponent as ButtonCopy } from "../../../../assets/svg/copy.svg";
import { ReactComponent as ButtonPaste } from "../../../../assets/svg/paste.svg";
import { ReactComponent as ButtonCut } from "../../../../assets/svg/cut.svg";
import store, { AppState } from "../../../redux/stores/renderer";
import OpenItem from "../open-item";
import OpenStep from "../open-step";
import { Tabs, TabsContainer } from "../../tabs";
import LessonTreeControls from "../lesson-tree-controls";
import reduxAction from "../../../redux/reduxAction";
import RecordingsView from "../recordings-view";
import idNamePos from "../../../../utils/idNamePos";

type Sections = "Lessons" | "Recordings";
const sections: Sections[] = ["Lessons", "Recordings"];

interface LessonProps {
  setTransparent: () => void;
  createRecorder: () => void;
}

export default function Lesson(props: LessonProps): JSX.Element {
  const dispatch = useDispatch();
  const { setTransparent, createRecorder } = props;
  const [view, setView] = useState<Sections>(sections[0]);
  const { treeCurrentType, treeCurrentId } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  const setViewPre = useCallback(
    (arg: Sections) => {
      if (arg == "Lessons") {
        reduxAction(dispatch, {
          type: "CREATE_LESSON_V2_DATA",
          arg: {
            currentRecording: undefined,
          },
        });
      }
      setView(arg);
    },
    [dispatch]
  );

  const doPreviewCurrentToNumber = useCallback(() => {
    const slice = store.getState().createLessonV2;

    const lessonId = slice.currentLesson;
    const chapterId = slice.currentChapter;
    const stepId = slice.currentStep;

    if (lessonId && chapterId && stepId) {
      const lesson = slice.treeLessons[lessonId];
      const chapter = slice.treeChapters[chapterId];
      const chapterPos = lesson ? idNamePos(lesson.chapters, chapterId) : 0;
      const stepPos = chapter ? idNamePos(chapter.steps, stepId) : 0;

      reduxAction(dispatch, {
        type: "SET_LESSON_PLAYER_DATA",
        arg: {
          playingChapterNumber: chapterPos > -1 ? chapterPos : 0,
          playingStepNumber: stepPos > -1 ? stepPos : 0,
        },
      });
    }
  }, [dispatch]);

  const doPreviewOne = useCallback(() => {
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: {
        lessonPreview: treeCurrentType == "lesson",
        chapterPreview: treeCurrentType == "chapter",
        stepPreview: treeCurrentType == "step",
        itemPreview: treeCurrentType == "item",
        previewOne: true,
      },
    });
    setTransparent();
    doPreviewCurrentToNumber();
  }, [dispatch, treeCurrentType, setTransparent]);

  const doPreview = useCallback(() => {
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: {
        lessonPreview: treeCurrentType == "lesson",
        chapterPreview: treeCurrentType == "chapter",
        stepPreview: treeCurrentType == "step",
        itemPreview: treeCurrentType == "item",
        previewOne: false,
      },
    });
    setTransparent();
    doPreviewCurrentToNumber();
  }, [dispatch, treeCurrentType, setTransparent, doPreviewCurrentToNumber]);

  return (
    <>
      <Tabs buttons={sections} initial={view} callback={setViewPre} />
      <TabsContainer
        style={{
          height: "-webkit-fill-available",
          flexGrow: 2,
          overflow: "auto",
        }}
      >
        {view == "Lessons" && <LessonTree />}
        {view == "Recordings" && (
          <RecordingsView createRecorder={createRecorder} />
        )}
      </TabsContainer>
      {view == "Lessons" && (
        <div className="create-lesson-item-container mid-tight">
          <LessonTreeControls />
        </div>
      )}
      {treeCurrentType == "item" && view == "Lessons" && (
        <OpenItem id={treeCurrentId} />
      )}
      {treeCurrentType == "step" && view == "Lessons" && (
        <OpenStep id={treeCurrentId} />
      )}
      {view == "Lessons" && (
        <div className="create-lesson-item-container mid-tight">
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
              onClick={() => {}}
              svg={ButtonNext}
              style={{ marginRight: "8px" }}
            />
            <ButtonRound
              width="36px"
              height="36px"
              disabled={
                treeCurrentType !== "step" && treeCurrentType !== "item"
              }
              iconFill="var(--color-red)"
              onClick={doPreviewOne}
              svg={ButtonPlay}
              style={{ marginRight: "8px" }}
            />
            <ButtonRound
              width="36px"
              height="36px"
              iconFill="var(--color-green)"
              onClick={doPreview}
              svg={ButtonPlay}
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
      )}
    </>
  );
}
