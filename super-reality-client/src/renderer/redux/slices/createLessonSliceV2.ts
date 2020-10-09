/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ILessonV2 } from "../../api/types/lesson-v2/lesson";
import { IChapter } from "../../api/types/chapter/chapter";
import { IStep } from "../../api/types/step/step";
import { Item } from "../../api/types/item/item";
import { IAnchor } from "../../api/types/anchor/anchor";
import { IDName } from "../../api/types";

export type TreeTypes = "none" | "chapter" | "lesson" | "step" | "item";

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
  treeLessons: {} as Record<string, ILessonV2>,
  treeChapters: {} as Record<string, IChapter>,
  treeSteps: {} as Record<string, IStep>,
  treeItems: {} as Record<string, Item>,
  treeAnchors: {} as Record<string, IAnchor>,
};

type InitialState = typeof initialState;

function idInIdName(arr: IDName[], id: string): boolean {
  return arr.filter((d) => d._id == id).length > 0;
}

function idNamePos(arr: IDName[], id: string): number {
  let ret = -1;
  arr.forEach((d, i) => {
    if (d._id == id) ret = i;
  });
  return ret;
}

const createLessonSlice = createSlice({
  name: "createLessonV2",
  initialState,
  reducers: {
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
        [chapter._id]: action.payload.chapter,
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
        [step._id]: action.payload.step,
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
        [action.payload.item._id]: action.payload.item,
      };
    },
    setAnchor: (
      state: InitialState,
      action: PayloadAction<{ anchor: IAnchor; item?: string }>
    ): void => {
      const { anchor, item } = action.payload;

      if (item) {
        state.treeItems[item].anchor = anchor._id;
      }

      state.treeAnchors = {
        ...state.treeAnchors,
        [action.payload.anchor._id]: action.payload.anchor,
      };
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
    selectEvent: (state: InitialState, action: PayloadAction<null>): void => {
      // eslint-disable-next-line operator-assignment
      state.toggleSelects = state.toggleSelects + 1;
    },
  },
});

export const {
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
  setAnchor,
  setOpenTree,
  selectEvent,
} = createLessonSlice.actions;

export default createLessonSlice;
