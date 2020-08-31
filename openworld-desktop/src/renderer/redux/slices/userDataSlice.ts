/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Just store the IDs and the data elsewhere
// redux can get clunky with data that is too complex/deep
const initialState = {
  lessons: [] as string[],
  collections: [] as string[],
  subjects: [] as string[],
};

type AuthState = typeof initialState;

function toggleFromArray(state: string[], value: string): string[] {
  const pos = state.indexOf(value);
  let ret: string[] = [...state];
  if (pos == -1) {
    ret = [...ret, value];
  } else {
    ret.splice(pos, 1);
  }
  return ret;
}

const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    clearUserData: (state: AuthState, action: PayloadAction<null>): void => {
      state = { ...initialState };
    },
    toggleCollection: (
      state: AuthState,
      action: PayloadAction<string>
    ): void => {
      state.collections = toggleFromArray(state.collections, action.payload);
    },
    toggleSubject: (state: AuthState, action: PayloadAction<string>): void => {
      state.subjects = toggleFromArray(state.subjects, action.payload);
    },
    toggleLesson: (state: AuthState, action: PayloadAction<string>): void => {
      state.lessons = toggleFromArray(state.lessons, action.payload);
    },
  },
});

export const {
  clearUserData,
  toggleCollection,
  toggleSubject,
  toggleLesson,
} = userDataSlice.actions;

export default userDataSlice;
