/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EntryOptions, DifficultyOptions } from "../../api/types/lesson/lesson";
import { ILessonV2, StatusOptions } from "../../api/types/lesson-v2/lesson";

const initialState: ILessonV2 = {
  _id: "string",
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
};

const createLessonSlice = createSlice({
  name: "createLessonV2",
  initialState,
  reducers: {
    setData: (
      state: ILessonV2,
      action: PayloadAction<Partial<ILessonV2>>
    ): void => {
      state = Object.assign(state, action.payload);
    },
  },
});

export const { setData } = createLessonSlice.actions;

export default createLessonSlice;
