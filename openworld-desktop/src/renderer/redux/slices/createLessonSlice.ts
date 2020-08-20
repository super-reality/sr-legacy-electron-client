/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import constants from "../../api/constant";

export const InitalFnOptions = {
  "Computer vision On": constants.Image_Function.Computer_Vision_On,
  "Computer vision On but invisible":
    constants.Image_Function.Computer_Vision_On_But_Visible,
  "Computer vision Off": constants.Image_Function.Computer_Vision_Off,
};

export const FnOptions = {
  And: constants.Image_Function_Additional.And,
  Or: constants.Image_Function_Additional.Or,
  Ignore: constants.Image_Function_Additional.Ignore,
};

export const TriggerOptions = {
  "On Step loaded": constants.Step_Trigger.On_Step_Loaded,
  "On Focus detected": constants.Step_Trigger.On_Focus_Detected,
  "On Gaze detected": constants.Step_Trigger.On_Gaze_Detected,
  "On Highlight clicked": constants.Step_Trigger.On_Highlight_Clicked,
};

export const NextStepOptions = {
  "Press Next Step": constants.Next_Step.Press_Next_Step_Button,
  "On Highlight Clicked": constants.Next_Step.On_Highlight_Clicked,
  "On text reading finished": constants.Next_Step.On_Text_Reading_Finished,
};

export interface CVFn {
  image: string;
  fn: number;
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
    publish: (state: CreateLessonState, action: any): void => {
      // console.log(action, "state");
    },
  },
});

export const { setData, addTag, addStep, publish } = createLessonSlice.actions;

export default createLessonSlice;
