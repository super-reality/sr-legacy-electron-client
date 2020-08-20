/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  TriggerOptions,
  NextStepOptions,
  IStep,
} from "../../api/types/step/step";
import { ILesson } from "../../api/types/lesson/lesson";

const InitialStep = {
  cv: [],
  icon: "",
  name: "",
  description: "",
  trigger: TriggerOptions["On Highlight clicked"],
  next: NextStepOptions["Press Next Step"],
};

const initialState: ILesson = {
  subjectId: "",
  icon: "",
  name: "",
  shortDescription: "",
  description: "",
  medias: [] as string[],
  tags: [] as string[],
  visibility: "public",
  entry: "bid",
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
    publish: (state: ILesson, action: any): void => {
      // console.log(action, "state");
    },
  },
});

export const { setData, addTag, addStep, publish } = createLessonSlice.actions;

export default createLessonSlice;
