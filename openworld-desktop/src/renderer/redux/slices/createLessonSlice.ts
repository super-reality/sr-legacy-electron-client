/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IStep } from "../../api/types/step/step";
import { ILesson } from "../../api/types/lesson/lesson";

const initialState: ILesson = {
  parent: [],
  difficulty: 0,
  ownership: [],
  tags: [],
  icon: "",
  name: "",
  shortDescription: "",
  description: "",
  medias: [],
  visibility: [],
  entry: "Bid",
  steps: [],
};

const createLessonSlice = createSlice({
  name: "createLesson",
  initialState,
  reducers: {
    setData: (
      state: ILesson,
      action: PayloadAction<Partial<ILesson>>
    ): void => {
      state = Object.assign(state, action.payload);
    },
    addTag: (state: ILesson, action: PayloadAction<string>): void => {
      state.tags = [...state.tags, action.payload];
    },
    addStep: (state: ILesson, action: PayloadAction<IStep>): void => {
      state.steps = [...state.steps, action.payload];
    },
    reset: (state: ILesson, action: PayloadAction<null>): void => {
      state = Object.assign(state, initialState);
    },
  },
});

export const { setData, addTag, addStep, reset } = createLessonSlice.actions;

export default createLessonSlice;
