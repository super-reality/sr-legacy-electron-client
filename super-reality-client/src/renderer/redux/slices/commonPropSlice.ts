/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DetachArg } from "../../../utils/handleIpc";

const initialState = {
  isLoading: false,
  detached: undefined as DetachArg | undefined,
  background: false as boolean,
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
    setDetached: (
      state: commonPropState,
      action: PayloadAction<DetachArg>
    ): void => {
      state.detached = action.payload;
    },
    setBackground: (
      state: commonPropState,
      action: PayloadAction<boolean>
    ): void => {
      state.background = action.payload;
    },
  },
});

export const {
  setIsLoading,
  setDetached,
  setBackground,
} = commonPropSlice.actions;

export default commonPropSlice;
