/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
};

type commonPropState = typeof initialState;

const commonPropSlice = createSlice({
  name: "commonProp",
  initialState,
  reducers: {
    setIsLoading: (
      state: commonPropState,
      action: PayloadAction<boolean>
    ): void => {
      state.isLoading = action.payload;
    },
  },
});

export const { setIsLoading } = commonPropSlice.actions;

export default commonPropSlice;
