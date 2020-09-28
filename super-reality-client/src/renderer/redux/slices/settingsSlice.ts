/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialCVSettings } from "../static";

const initialState = {
  cv: initialCVSettings,
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
