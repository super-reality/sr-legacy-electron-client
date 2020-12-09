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

import { ReactComponent as RecordIcon } from "../../../../assets/svg/record.svg";
import store, { AppState } from "../../../redux/stores/renderer";
import OpenItem from "../open-item";
import OpenStep from "../open-step";
import { Tabs, TabsContainer } from "../../tabs";
import LessonTreeControls from "../lesson-tree-controls";
import reduxAction from "../../../redux/reduxAction";
import RecordingsView from "../recordings-view";
import idNamePos from "../../../../utils/idNamePos";
import { voidFunction } from "../../../constants";

type Sections = "Lessons" | "Recordings";
const sections: Sections[] = ["Lessons", "Recordings"];

interface LessonProps {
  createRecorder: () => void;
}

export default function Lesson(props: LessonProps): JSX.Element {
  const dispatch = useDispatch();
  const { createRecorder } = props;
  const [view, setView] = useState<Sections>(sections[0]);
  const { treeCurrentType, treeCurrentId } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  const setViewPre = useCallback(
    (arg: Sections) => {
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
    } else if (lessonId && chapterId) {
      const lesson = slice.treeLessons[lessonId];
      const chapterPos = lesson ? idNamePos(lesson.chapters, chapterId) : 0;

      reduxAction(dispatch, {
        type: "SET_LESSON_PLAYER_DATA",
        arg: {
          playingChapterNumber: chapterPos > -1 ? chapterPos : 0,
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
        anchorTestView: false,
        previewing: true,
        previewOne: true,
      },
    });
    doPreviewCurrentToNumber();
  }, [dispatch, treeCurrentType, doPreviewCurrentToNumber]);

  const doPreview = useCallback(() => {
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: {
        lessonPreview: treeCurrentType == "lesson",
        chapterPreview: treeCurrentType == "chapter",
        stepPreview: treeCurrentType == "step",
        itemPreview: treeCurrentType == "item",
        anchorTestView: false,
        previewing: true,
        previewOne: false,
      },
    });
    doPreviewCurrentToNumber();
  }, [dispatch, treeCurrentType, doPreviewCurrentToNumber]);

  return (
    <>
      <div
        className="tree-container"
        style={{
          height: `calc(100% - ${view == "Recordings" ? "80px" : "372px"})`,
        }}
      >
        <Tabs buttons={sections} initial={view} callback={setViewPre} />
        <TabsContainer
          style={{
            height: "-webkit-fill-available",
            flexGrow: 2,
            overflow: "auto",
          }}
        >
          {view == "Lessons" && <LessonTree />}
          {view == "Recordings" && <RecordingsView />}
        </TabsContainer>
      </div>
      {view == "Recordings" && (
        <ButtonRound
          svg={RecordIcon}
          width="48px"
          height="48px"
          svgStyle={{ width: "32px", height: "32px" }}
          style={{ margin: "16px auto" }}
          onClick={createRecorder}
        />
      )}
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
          <Flex style={{ margin: "auto" }}>
            <ButtonRound
              width="36px"
              height="36px"
              onClick={voidFunction}
              svg={ButtonPrev}
              style={{ marginRight: "8px" }}
            />
            <ButtonRound
              width="36px"
              height="36px"
              onClick={voidFunction}
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
          </Flex>
        </div>
      )}
    </>
  );
}
