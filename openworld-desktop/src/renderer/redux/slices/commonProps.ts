/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { bool } from "aws-sdk/clients/signer";

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
      action: PayloadAction<bool>
    ): void => {
      state.isLoading = action.payload;
    },
  },
});

export const { setIsLoading } = commonPropSlice.actions;

export default commonPropSlice;
