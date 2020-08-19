/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  subjectId: "",
  icon: "",
  name: "",
  shortDescription: "",
  description: "",
  medias: [] as string[],
  tags: [] as string[],
  visibility: "public",
  entry: "bid",
  steps: [
    { _id: "" },
    {
      icon: "",
      name: "",
      trigger: "on cv target found",
      description: "",
      action: "read text",
      next: 1,
    },
  ],
};

type CreateLessonState = typeof initialState;

const createLessonSlice = createSlice({
  name: "createLesson",
  initialState,
  reducers: {
    setData: (
      state: CreateLessonState,
      action: PayloadAction<Partial<CreateLessonState>>
    ): void => {
      state = Object.assign(state, action.payload);
      // state = { ...state, ...action.payload };
    },
    addTag: (state: CreateLessonState, action: PayloadAction<string>): void => {
      state.tags = [...state.tags, action.payload];
    },
  },
});

export const { setData, addTag } = createLessonSlice.actions;

export default createLessonSlice;
