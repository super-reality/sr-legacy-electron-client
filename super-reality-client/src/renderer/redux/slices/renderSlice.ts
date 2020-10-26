/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CVResult } from "../../../types/utils";

export type tabNames = "Discover" | "Learn" | "Teach" | "Create";

const initialState = {
  yScroll: 0,
  yScrollMoveTo: undefined as number | undefined,
  yScrollDelta: 0,
  topInputStates: {} as Record<string, string>,
  overlayTransparent: false as boolean,
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
    setOverlayTransparent: (
      state: RenderState,
      action: PayloadAction<boolean>
    ): void => {
      state.overlayTransparent = action.payload;
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
  },
});

export const {
  setYScroll,
  setOverlayTransparent,
  setYScrollMoveTo,
  setTopInput,
  setCvResult,
} = renderSlice.actions;

export default renderSlice;
