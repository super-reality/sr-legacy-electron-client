/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import SignIn from "../../api/types/auth/signin";

const initialState = {
  isValid: true, // true disables auth !
  isPending: false,
  updatedAt: Date.now(),
  token: "",
  name: "",
  avatarUrl:
    "https://qph.fs.quoracdn.net/main-qimg-87001d2ce810c2f48c97032cbc905939.webp",
};

type AuthState = typeof initialState;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthPending: (state: AuthState, action: PayloadAction<null>): void => {
      state.isPending = true;
    },
    setAuthSucessful: (
      state: AuthState,
      action: PayloadAction<SignIn>
    ): void => {
      const { firstname, lastname } = action.payload.user;
      state.updatedAt = Date.now();
      state.isValid = true;
      state.token = action.payload.token;
      state.name = `${firstname} ${lastname}`;
    },
    setAuthFailed: (state: AuthState, action: PayloadAction<null>): void => {
      state.updatedAt = Date.now();
      state.isValid = false;
      state.isPending = false;
    },
    setAuthInvalidated: (
      state: AuthState,
      action: PayloadAction<null>
    ): void => {
      state.updatedAt = Date.now();
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
} = authSlice.actions;

export default authSlice;
