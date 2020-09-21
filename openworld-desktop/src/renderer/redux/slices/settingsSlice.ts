/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  cvThreshold: 990,
  cvCanvas: 1024,
  cvDelay: 100,
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
