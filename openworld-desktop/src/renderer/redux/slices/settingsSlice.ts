/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  cv: {
    cvMatchValue: 990,
    cvCanvas: 50,
    cvDelay: 100,
    cvGrayscale: true as boolean,
    cvApplyThreshold: false as boolean,
    cvThreshold: 127,
  },
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
    setCVSettings: (
      state: SettingsState,
      action: PayloadAction<Partial<SettingsState["cv"]>>
    ): void => {
      state.cv = Object.assign(state.cv, action.payload);
    },
  },
});

export const {
  clearsettings,
  setSettings,
  setCVSettings,
} = settingsSlice.actions;

export default settingsSlice;
