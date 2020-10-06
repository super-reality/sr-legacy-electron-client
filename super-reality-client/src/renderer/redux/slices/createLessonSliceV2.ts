/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EntryOptions, DifficultyOptions } from "../../api/types/lesson/lesson";
import { ILessonV2, StatusOptions } from "../../api/types/lesson-v2/lesson";
import { IChapter } from "../../api/types/chapter/chapter";
import { IStep } from "../../api/types/step/step";
import { Item } from "../../api/types/item/item";
import { IAnchor } from "../../api/types/anchor/anchor";

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
      state.treeChapters = {
        ...state.treeChapters,
        [action.payload._id]: action.payload,
      };
    },
    setStep: (state: InitialState, action: PayloadAction<IStep>): void => {
      state.treeSteps = {
        ...state.treeSteps,
        [action.payload._id]: action.payload,
      };
    },
    setItem: (state: InitialState, action: PayloadAction<Item>): void => {
      state.treeItems = {
        ...state.treeItems,
        [action.payload._id]: action.payload,
      };
    },
    setAnchor: (state: InitialState, action: PayloadAction<IAnchor>): void => {
      state.treeAnchors = {
        ...state.treeAnchors,
        [action.payload._id]: action.payload,
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
