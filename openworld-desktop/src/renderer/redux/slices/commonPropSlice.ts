/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DetachArg } from "../../../utils/handleIpc";

const initialState = {
  isLoading: false,
  detached: undefined as DetachArg | undefined,
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
  },
});

export const { setIsLoading, setDetached } = commonPropSlice.actions;

export default commonPropSlice;
