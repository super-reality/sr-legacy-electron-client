/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EntryOptions, DifficultyOptions } from "../../api/types/lesson/lesson";
import { ILessonV2, StatusOptions } from "../../api/types/lesson-v2/lesson";

export type TreeTypes = "none" | "chapter" | "lesson" | "step" | "item";

type InitialState = ILessonV2 & {
  treeCurrentType: TreeTypes;
  treeCurrentId: string;
  toggleSelects: number;
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
  toggleSelects: 0,
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
    setOpenTree: (
      state: InitialState,
      action: PayloadAction<{ type: TreeTypes; id: string }>
    ): void => {
      state.treeCurrentType = action.payload.type;
      state.treeCurrentId = action.payload.id;
      // eslint-disable-next-line operator-assignment
      state.toggleSelects = state.toggleSelects + 1;
    },
    selectEvent: (state: InitialState, action: PayloadAction<null>): void => {
      // eslint-disable-next-line operator-assignment
      state.toggleSelects = state.toggleSelects + 1;
    },
  },
});

export const { setData, setOpenTree, selectEvent } = createLessonSlice.actions;

export default createLessonSlice;
