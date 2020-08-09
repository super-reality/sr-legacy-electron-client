import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  yScroll: 0,
  yScrollDelta: 0,
};

type RenderState = typeof initialState;

const renderSlice = createSlice({
  name: "render",
  initialState,
  reducers: {
    setYScroll: (
      state: RenderState,
      action: PayloadAction<number>
    ): void => {
      state.yScrollDelta = state.yScroll - action.payload;
      state.yScroll = action.payload;
    }
  },
});

export const {
  setYScroll
} = renderSlice.actions;

export default renderSlice;
