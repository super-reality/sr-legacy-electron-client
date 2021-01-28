/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CVResult } from "../../../types/utils";

export type tabNames = "Discover" | "Learn" | "Teach" | "Create";

export const MODE_HOME = 1;
export const MODE_VOID = 4;

export type UI_MODES = typeof MODE_HOME | typeof MODE_VOID;

const initialState = {
  yScroll: 0,
  yScrollMoveTo: undefined as number | undefined,
  yScrollDelta: 0,
  topInputStates: {} as Record<string, string>,
  appMode: MODE_HOME as UI_MODES,
  ready: false,
  topMost: false,
  cvResult: {
    dist: 0,
    sizeFactor: 0,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  } as CVResult,
};

type RenderState = typeof initialState;

const renderSlice = createSlice({
  name: "render",
  initialState,
  reducers: {
    setYScroll: (state: RenderState, action: PayloadAction<number>): void => {
      state.yScrollDelta = state.yScroll - action.payload;
      state.yScroll = action.payload;
    },
    setAppMode: (state: RenderState, action: PayloadAction<UI_MODES>): void => {
      state.appMode = action.payload;
    },
    setTopMost: (state: RenderState, action: PayloadAction<boolean>): void => {
      state.topMost = action.payload;
    },
    setYScrollMoveTo: (
      state: RenderState,
      action: PayloadAction<number | undefined>
    ): void => {
      console.log("setYScrollMoveTo", action.payload);
      state.yScrollMoveTo = action.payload;
    },
    setTopInput: (
      state: RenderState,
      action: PayloadAction<{ str: string; path: string }>
    ): void => {
      state.topInputStates = {
        ...state.topInputStates,
        [action.payload.path]: action.payload.str,
      };
    },
    setCvResult: (
      state: RenderState,
      action: PayloadAction<CVResult>
    ): void => {
      state.cvResult = action.payload;
    },
    setReady: (state: RenderState, action: PayloadAction<boolean>): void => {
      state.ready = action.payload;
    },
  },
});

export const {
  setYScroll,
  setAppMode,
  setTopMost,
  setYScrollMoveTo,
  setTopInput,
  setCvResult,
  setReady,
} = renderSlice.actions;

export default renderSlice;
