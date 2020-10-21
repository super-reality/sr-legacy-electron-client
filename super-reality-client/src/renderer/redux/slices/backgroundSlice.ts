/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialBackgroundState } from "../static";

const initialState = initialBackgroundState;

type BackgroundState = typeof initialState;

const backgroundSlice = createSlice({
  name: "background",
  initialState,
  reducers: {
    setData: (
      state: BackgroundState,
      action: PayloadAction<Partial<BackgroundState>>
    ): void => {
      state = Object.assign(state, action.payload);
    },
  },
});

export const { setData } = backgroundSlice.actions;

export default backgroundSlice;
