/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ILessonV2 } from "../../api/types/lesson-v2/lesson";
import { IChapter } from "../../api/types/chapter/chapter";
import { IStep } from "../../api/types/step/step";
import { Item } from "../../items/item";
import { IAnchor } from "../../api/types/anchor/anchor";
import { IDName } from "../../api/types";
import { RecordingJson } from "../../components/recorder/types";
import idNamePos from "../../../utils/idNamePos";
import idInIdName from "../../../utils/idInIdName";

export type TreeTypes = "none" | "chapter" | "lesson" | "step" | "item";

export type VideoSources = "url" | "file" | "recording" | undefined;

export type PreviewModes =
  | "CREATE_ANCHOR"
  | "EDIT_ANCHOR"
  | "ADDTO_ANCHOR"
  | "TRIM_VIDEO"
  | "IDLE";

const initialState = {
  toggleSelects: 0 as number,
  treeCurrentType: "none" as TreeTypes,
  treeCurrentId: "",
  treeCurrentUniqueId: "",
  dragType: "none" as TreeTypes,
  dragId: "",
  dragParent: "",
  dragOver: "",
  lessons: [] as IDName[],
  videoNavigation: [0, 50, 100],
  videoDuration: 100,
  treeLessons: {} as Record<string, ILessonV2>,
  treeChapters: {} as Record<string, IChapter>,
  treeSteps: {} as Record<string, IStep>,
  treeItems: {} as Record<string, Item>,
  treeAnchors: {} as Record<string, IAnchor>,
  recordingTempItems: {} as Record<string, Item>,
  currentRecording: undefined as undefined | string,
  currentAnchor: undefined as undefined | string,
  currentItem: undefined as undefined | string,
  currentStep: undefined as undefined | string,
  currentChapter: undefined as undefined | string,
  currentLesson: undefined as undefined | string,
  currentSubView: "none" as TreeTypes,
  anchorTestView: false,
  lessonPreview: false,
  chapterPreview: false,
  stepPreview: false,
  itemPreview: false,
  previewing: false,
  previewOne: false,
  videoScale: 1,
  videoPos: { x: 0, y: 0 },
  triggerCvMatch: 0,
  recordingData: {
    step_data: [],
    spectrum: [],
  } as RecordingJson,
  recordingCvMatches: [] as {
    index: number;
    value: number;
  }[],
  recordingCvMatchValue: 990,
  recordingCvFrame: -1,
  previewEditArea: {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  },
  previewMode: "IDLE" as PreviewModes,
  editingAnchor: "",
  canvasSourceType: undefined as VideoSources,
  canvasSource: undefined as string | undefined,
  canvasSourceDesc: "no source" as string,
  status: "-",
  openPanel: undefined as string | undefined,
};

type InitialState = typeof initialState;

const createLessonSlice = createSlice({
  name: "createLessonV2",
  initialState,
  reducers: {
    clearRecordingCVData: (
      state: InitialState,
      _action: PayloadAction<null>
    ): void => {
      state.recordingCvFrame = 0;
      state.recordingCvMatches = [];
    },
    doTriggerCvMatch: (
      state: InitialState,
      _action: PayloadAction<null>
    ): void => {
      state.triggerCvMatch = new Date().getTime();
    },
    setRecordingCVData: (
      state: InitialState,
      action: PayloadAction<{
        index: number;
        value: number;
      }>
    ): void => {
      state.recordingCvFrame = action.payload.index;
      state.recordingCvMatches = [
        ...state.recordingCvMatches,
        { ...action.payload },
      ];
    },
    setRecordingData: (
      state: InitialState,
      action: PayloadAction<Partial<RecordingJson>>
    ): void => {
      state.recordingData = Object.assign(state.recordingData, action.payload);
    },
    setData: (
      state: InitialState,
      action: PayloadAction<Partial<InitialState>>
    ): void => {
      state = Object.assign(state, action.payload);
    },
    setDrag: (
      state: InitialState,
      action: PayloadAction<{ type: TreeTypes; id: string; parentId: string }>
    ): void => {
      state.dragType = action.payload.type;
      state.dragId = action.payload.id;
      state.dragParent = action.payload.parentId;
      if (action.payload.id == "") state.dragOver = "";
    },
    setDragOver: (state: InitialState, action: PayloadAction<string>): void => {
      state.dragOver = action.payload;
    },
    doMove: (
      state: InitialState,
      action: PayloadAction<{
        type: TreeTypes;
        idFrom: string;
        idTo: string;
        parentId: string;
      }>
    ): void => {
      const { type, idFrom, idTo, parentId } = action.payload;
      if (type == "lesson") {
        const sourcePos = idNamePos(state.lessons, idFrom);
        state.lessons.splice(sourcePos, 1);
        const destPos = idNamePos(state.lessons, idTo);
        state.lessons.splice(destPos, 0, {
          _id: idFrom,
          name: state.treeLessons[idFrom].name,
        });
      }
      if (type == "chapter") {
        const sourcePos = idNamePos(
          state.treeLessons[parentId].chapters,
          idFrom
        );
        state.treeLessons[parentId].chapters.splice(sourcePos, 1);
        const destPos = idNamePos(state.treeLessons[parentId].chapters, idTo);
        state.treeLessons[parentId].chapters.splice(destPos, 0, {
          _id: idFrom,
          name: state.treeChapters[idFrom].name,
        });
      }
      if (type == "step") {
        const sourcePos = idNamePos(state.treeChapters[parentId].steps, idFrom);
        state.treeChapters[parentId].steps.splice(sourcePos, 1);
        const destPos = idNamePos(state.treeChapters[parentId].steps, idTo);
        state.treeChapters[parentId].steps.splice(destPos, 0, {
          _id: idFrom,
          name: state.treeSteps[idFrom].name,
        });
      }
      if (type == "item") {
        const sourcePos = idNamePos(state.treeSteps[parentId].items, idFrom);
        state.treeSteps[parentId].items.splice(sourcePos, 1);
        const destPos = idNamePos(state.treeSteps[parentId].items, idTo);
        state.treeSteps[parentId].items.splice(destPos, 0, {
          _id: idFrom,
          name: state.treeItems[idFrom].name,
        });
      }
    },
    doCut: (
      state: InitialState,
      action: PayloadAction<{
        type: TreeTypes;
        id: string;
        sourceParent: string;
        destParent: string;
      }>
    ): void => {
      const { type, id, sourceParent, destParent } = action.payload;
      if (type == "chapter") {
        // parent is lesson
        const sourcePos = idNamePos(
          state.treeLessons[sourceParent].chapters,
          id
        );
        state.treeLessons[sourceParent].chapters.splice(sourcePos, 1);
        state.treeLessons[destParent].chapters.push({
          _id: id,
          name: state.treeChapters[id].name,
        });
      }
      if (type == "step") {
        // parent is chapter
        const sourcePos = idNamePos(state.treeChapters[sourceParent].steps, id);
        state.treeChapters[sourceParent].steps.splice(sourcePos, 1);
        state.treeChapters[destParent].steps.push({
          _id: id,
          name: state.treeSteps[id].name,
        });
      }
      if (type == "item") {
        // parent is step
        const sourcePos = idNamePos(state.treeSteps[sourceParent].items, id);
        state.treeSteps[sourceParent].items.splice(sourcePos, 1);
        state.treeSteps[destParent].items.push({
          _id: id,
          name: state.treeItems[id].name,
        });
      }
    },
    doDelete: (
      state: InitialState,
      action: PayloadAction<{
        type: TreeTypes;
        id: string;
        parentId: string;
      }>
    ): void => {
      const { type, id, parentId } = action.payload;
      if (type == "chapter") {
        // parent is lesson
        const sourcePos = idNamePos(state.treeLessons[parentId].chapters, id);
        state.treeLessons[parentId].chapters.splice(sourcePos, 1);
      }
      if (type == "step") {
        // parent is chapter
        const sourcePos = idNamePos(state.treeChapters[parentId].steps, id);
        state.treeChapters[parentId].steps.splice(sourcePos, 1);
      }
      if (type == "item") {
        // parent is step
        const sourcePos = idNamePos(state.treeSteps[parentId].items, id);
        state.treeSteps[parentId].items.splice(sourcePos, 1);
      }
    },
    setLesson: (
      state: InitialState,
      action: PayloadAction<ILessonV2>
    ): void => {
      const lesson = action.payload;
      if (lesson && !idInIdName(state.lessons, lesson._id)) {
        state.lessons = [
          ...state.lessons,
          { name: lesson.name, _id: lesson._id },
        ];
      }

      state.treeLessons = {
        ...state.treeLessons,
        [lesson._id]: lesson,
      };
    },
    setChapter: (
      state: InitialState,
      action: PayloadAction<{ chapter: IChapter; lesson?: string }>
    ): void => {
      const { chapter, lesson } = action.payload;
      if (
        lesson &&
        !idInIdName(state.treeLessons[lesson].chapters, chapter._id)
      ) {
        state.treeLessons[lesson].chapters = [
          ...state.treeLessons[lesson].chapters,
          { name: chapter.name, _id: chapter._id },
        ];
      }

      state.treeChapters = {
        ...state.treeChapters,
        [chapter._id]: chapter,
      };
    },
    setStep: (
      state: InitialState,
      action: PayloadAction<{ step: IStep; chapter?: string }>
    ): void => {
      const { step, chapter } = action.payload;

      if (chapter && !idInIdName(state.treeChapters[chapter].steps, step._id)) {
        state.treeChapters[chapter].steps = [
          ...state.treeChapters[chapter].steps,
          { name: step.name, _id: step._id },
        ];
      }

      state.treeSteps = {
        ...state.treeSteps,
        [step._id]: step,
      };
    },
    setItem: (
      state: InitialState,
      action: PayloadAction<{ item: Item; step?: string }>
    ): void => {
      const { item, step } = action.payload;

      if (step && !idInIdName(state.treeSteps[step].items, item._id)) {
        state.treeSteps[step].items = [
          ...state.treeSteps[step].items,
          { name: item.name, _id: item._id },
        ];
      }

      state.treeItems = {
        ...state.treeItems,
        [item._id]: item,
      };
    },
    setTempItem: (
      state: InitialState,
      action: PayloadAction<{ item: Item }>
    ): void => {
      const { item } = action.payload;

      state.recordingTempItems = {
        ...state.recordingTempItems,
        [item._id]: item,
      };
    },
    setAnchor: (
      state: InitialState,
      action: PayloadAction<{ anchor: IAnchor; step?: string }>
    ): void => {
      const { anchor, step } = action.payload;

      if (step) {
        state.treeSteps[step].anchor = anchor._id;
      }

      state.treeAnchors = {
        ...state.treeAnchors,
        [anchor._id]: anchor,
      };
    },
    deleteAnchor: (
      state: InitialState,
      action: PayloadAction<{ anchorId: string }>
    ): void => {
      const { anchorId } = action.payload;

      const newTree = { ...state.treeAnchors };
      delete newTree[anchorId];

      state.treeAnchors = newTree;
    },
    setOpenTree: (
      state: InitialState,
      action: PayloadAction<{ type: TreeTypes; uniqueId: string; id: string }>
    ): void => {
      state.treeCurrentType = action.payload.type;
      state.treeCurrentId = action.payload.id;
      state.treeCurrentUniqueId = action.payload.uniqueId;
      // eslint-disable-next-line operator-assignment
      state.toggleSelects = state.toggleSelects + 1;
    },
    selectEvent: (state: InitialState, _action: PayloadAction<null>): void => {
      // eslint-disable-next-line operator-assignment
      state.toggleSelects = state.toggleSelects + 1;
    },
  },
});

export const {
  clearRecordingCVData,
  setRecordingCVData,
  setRecordingData,
  setData,
  setDrag,
  setDragOver,
  doMove,
  doCut,
  doDelete,
  setLesson,
  setChapter,
  setStep,
  setItem,
  setTempItem,
  setAnchor,
  deleteAnchor,
  setOpenTree,
  selectEvent,
  doTriggerCvMatch,
} = createLessonSlice.actions;

export default createLessonSlice;
