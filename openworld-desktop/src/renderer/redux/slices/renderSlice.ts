import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
  yScroll: 0,
  yScrollDelta: 0,
  topSelectStates: {} as Record<string, string>,
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
      action: PayloadAction<{selected: string; path: string}>
    ): void => {
      state.topSelectStates = {
        ...state.topSelectStates,
        [action.payload.path]: action.payload.selected,
      };
    },
  },
});

export const {setYScroll, setTopSelect} = renderSlice.actions;

export default renderSlice;
