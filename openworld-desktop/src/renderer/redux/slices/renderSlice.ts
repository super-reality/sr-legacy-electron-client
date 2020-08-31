/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type tabNames = "Discover" | "Learn" | "Teach" | "Create";

const initialState = {
  yScroll: 0,
  yScrollDelta: 0,
  topInputStates: {} as Record<string, string>,
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
    setTopInput: (
      state: RenderState,
      action: PayloadAction<{ str: string; path: string }>
    ): void => {
      state.topInputStates = {
        ...state.topInputStates,
        [action.payload.path]: action.payload.str,
      };
    },
  },
});

export const { setYScroll, setTopInput } = renderSlice.actions;

export default renderSlice;
