/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  playing: false,
  playingChapterNumber: 0,
  playingStepNumber: 0,
};

type InitialState = typeof initialState;

const lessonPlayerSlice = createSlice({
  name: "lessonPlayer",
  initialState,
  reducers: {
    setLessonPlayerData: (
      state: InitialState,
      action: PayloadAction<Partial<InitialState>>
    ): void => {
      state = Object.assign(state, action.payload);
    },
    reset: (state: InitialState, action: PayloadAction<null>): void => {
      state = Object.assign(state, initialState);
    },
    setPlaying: (state: InitialState, action: PayloadAction<boolean>): void => {
      state.playing = action.payload;
    },
  },
});

export const {
  setLessonPlayerData,
  reset,
  setPlaying,
} = lessonPlayerSlice.actions;

export default lessonPlayerSlice;
