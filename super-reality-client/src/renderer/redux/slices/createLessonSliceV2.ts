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

type InitialState = ILessonV2 & {
  treeCurrentType: TreeTypes;
  treeCurrentId: string;
  treeCurrentParentId: string;
  toggleSelects: number;
  treeChapters: Record<string, IChapter>;
  treeSteps: Record<string, IStep>;
  treeItems: Record<string, Item>;
  treeAnchors: Record<string, IAnchor>;
};

const initialState: InitialState = {
  _id: "string",
  name: "",
  cost: 0,
  status: StatusOptions.Draft,
  description: "",
  entry: EntryOptions.Open,
  skills: [],
  difficulty: DifficultyOptions.Beginner,
  media: [],
  location: {}, // parent
  chapters: [],
  setupScreenshots: [],
  setupInstructions: "",
  setupFiles: [],
  treeCurrentType: "none",
  treeCurrentId: "",
  treeCurrentParentId: "",
  toggleSelects: 0,
  treeChapters: {},
  treeSteps: {},
  treeItems: {},
  treeAnchors: {},
};

function idInIdName(arr: IDName[], id: string): boolean {
  return arr.filter((d) => d._id == id).length > 0;
}

const createLessonSlice = createSlice({
  name: "createLessonV2",
  initialState,
  reducers: {
    setData: (
      state: InitialState,
      action: PayloadAction<Partial<ILessonV2>>
    ): void => {
      state = Object.assign(state, action.payload);
    },
    setChapter: (
      state: InitialState,
      action: PayloadAction<IChapter>
    ): void => {
      if (!idInIdName(state.chapters, action.payload._id)) {
        state.chapters = [
          ...state.chapters,
          { name: action.payload.name, _id: action.payload._id },
        ];
      }

      state.treeChapters = {
        ...state.treeChapters,
        [action.payload._id]: action.payload,
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
  setChapter,
  setStep,
  setItem,
  setAnchor,
  setOpenTree,
  selectEvent,
} = createLessonSlice.actions;

export default createLessonSlice;
