/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Category from "../../../types/collections";

export type tabNames = "Discover" | "Learn" | "Teach" | "Create" | "Profile";

const initialState = {
  yScroll: 0,
  yScrollDelta: 0,
  topSelectStates: {
    Discover: Category.All,
    Learn: Category.All,
    Teach: Category.All,
    Create: Category.Help,
    Profile: "",
  } as Record<tabNames, Category | string>,
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
    setTopSelect: (
      state: RenderState,
      action: PayloadAction<{ selected: Category | string; path: string }>
    ): void => {
      state.topSelectStates = {
        ...state.topSelectStates,
        [action.payload.path]: action.payload.selected,
      };
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

export const { setYScroll, setTopSelect, setTopInput } = renderSlice.actions;

export default renderSlice;
