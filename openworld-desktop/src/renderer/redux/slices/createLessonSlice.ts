/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum InitalFnOptions {
  "Computer vision On" = "Computer vision On",
  "Computer vision On but invisible" = "Computer vision On but invisible",
  "Computer vision Off" = "Computer vision Off",
}

export enum FnOptions {
  "And" = "And",
  "Or" = "Or",
  "Ignore" = "Ignore",
}

export enum TriggerOptions {
  "On Step loaded" = "On Step loaded",
  "On Focus detected" = "On Focus detected",
  "On Gaze detected" = "On Gaze detected",
  "On Highlight clicked" = "On Highlight clicked",
}

export enum NextStepOptions {
  "Press Next Step" = "Press Next Step",
  "On Highlight Clicked" = "On Highlight Clicked",
  "On text reading finished" = "On text reading finished",
}

export interface CVFn {
  image: string;
  fn: FnOptions | InitalFnOptions;
}

const InitialStep = {
  cv: [] as CVFn[],
  icon: "",
  name: "",
  description: "",
  trigger: Object.keys(TriggerOptions)[0],
  next: Object.keys(NextStepOptions)[0],
};

export type InitialStepType = typeof InitialStep;

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
  steps: [] as InitialStepType[],
};

export type CreateLessonState = typeof initialState;

const createLessonSlice = createSlice({
  name: "createLesson",
  initialState,
  reducers: {
    setData: (
      state: CreateLessonState,
      action: PayloadAction<Partial<CreateLessonState>>
    ): void => {
      state = Object.assign(state, action.payload);
    },
    addTag: (state: CreateLessonState, action: PayloadAction<string>): void => {
      state.tags = [...state.tags, action.payload];
    },
    addStep: (
      state: CreateLessonState,
      action: PayloadAction<InitialStepType>
    ): void => {
      state.steps = [...state.steps, action.payload];
    },
  },
});

export const { setData, addTag, addStep } = createLessonSlice.actions;

export default createLessonSlice;
