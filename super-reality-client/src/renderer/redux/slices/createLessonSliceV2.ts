/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EntryOptions, DifficultyOptions } from "../../api/types/lesson/lesson";
import { ILessonV2, StatusOptions } from "../../api/types/lesson-v2/lesson";
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
  treeCurrentParentId: "",
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
      action: PayloadAction<{ type: TreeTypes; parentId: string; id: string }>
    ): void => {
      state.treeCurrentType = action.payload.type;
      state.treeCurrentId = action.payload.id;
      state.treeCurrentParentId = action.payload.parentId;
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
  setLesson,
  setChapter,
  setStep,
  setItem,
  setAnchor,
  setOpenTree,
  selectEvent,
} = createLessonSlice.actions;

export default createLessonSlice;
