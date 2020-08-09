import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  isValid: true,
  isPending: false,
  updatedAt: Date.now(),
  token: "",
};

type AuthState = typeof initialState;

const hoverSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthPending: (
      state: AuthState,
      action: PayloadAction<null>
    ): void => {
      state.isPending = true;
    },
    setAuthSucessful: (
      state: AuthState,
      action: PayloadAction<AuthState["token"]>
    ): void => {
      state.token = action.payload;
    },
    setAuthFailed: (
      state: AuthState,
      action: PayloadAction<null>
    ): void => {
      state.isValid = false;
      state.isPending = false;
    },
    setAuthInvalidated: (
      state: AuthState,
      action: PayloadAction<null>
    ): void => {
      state.isValid = false;
      state.isPending = false;
    },
  },
});

export const {
  setAuthPending,
  setAuthSucessful,
  setAuthFailed,
  setAuthInvalidated,
} = hoverSlice.actions;

export default hoverSlice;
