/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  TriggerOptions,
  NextStepOptions,
  IStep,
} from "../../api/types/step-old/step";

export const initialState: IStep = {
  index: undefined,
  images: [],
  functions: [],
  name: "",
  trigger: Object.values(TriggerOptions)[0],
  description: "",
  next: Object.values(NextStepOptions)[0],
  cvMatchValue: 990,
  cvCanvas: 50,
  cvDelay: 100,
  cvGrayscale: true,
  cvApplyThreshold: false,
  cvThreshold: 127,
};

const createStepSlice = createSlice({
  name: "createStep",
  initialState,
  reducers: {
    setData: (state: IStep, action: PayloadAction<Partial<IStep>>): void => {
      state = Object.assign(state, action.payload);
    },
    reset: (state: IStep, action: PayloadAction<null>): void => {
      state = Object.assign(state, initialState);
      state.images = [];
      state.functions = [];
    },
  },
});

export const { setData, reset } = createStepSlice.actions;

export default createStepSlice;
