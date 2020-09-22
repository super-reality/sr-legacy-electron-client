/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  cvMatchValue: 990,
  cvCanvas: 100,
  cvDelay: 100,
  cvGrayscale: true as boolean,
  cvApplyThreshold: false as boolean,
  cvThreshold: 127,
};

type SettingsState = typeof initialState;

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    clearsettings: (
      state: SettingsState,
      action: PayloadAction<null>
    ): void => {
      state = { ...initialState };
    },
    setSettings: (
      state: SettingsState,
      action: PayloadAction<Partial<SettingsState>>
    ): void => {
      state = Object.assign(state, action.payload);
    },
  },
});

export const { clearsettings, setSettings } = settingsSlice.actions;

export default settingsSlice;
