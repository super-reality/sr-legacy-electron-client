import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  isValid: false,
  isPending: false,
  updatedAt: Date.now(),
  token: null as string | null,
};

type AuthState = typeof initialState;

const hoverSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthPending: (
      state: AuthState,
      _action: PayloadAction<unknown>
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
      _action: PayloadAction<unknown>
    ): void => {
      state.isValid = false;
      state.isPending = false;
    },
    setAuthInvalidated: (
      state: AuthState,
      _action: PayloadAction<unknown>
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
