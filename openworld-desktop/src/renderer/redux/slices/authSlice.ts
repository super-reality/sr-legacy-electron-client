/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Axios from "axios";
import SignIn from "../../api/types/auth/signin";

const initialState = {
  isValid: false, // true disables auth !
  isPending: false,
  updatedAt: Date.now(),
  token: "",
  name: "",
  points: 100,
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
      if (action.payload.token) {
        Axios.defaults.headers.post.Authorization = `Bearer ${action.payload.token}`;
        Axios.defaults.headers.get.Authorization = `Bearer ${action.payload.token}`;
        Axios.defaults.headers.delete.Authorization = `Bearer ${action.payload.token}`;
        state.token = action.payload.token;
      }
      state.name = `${firstname} ${lastname}`;
    },
    setAuthToken: (state: AuthState, action: PayloadAction<string>): void => {
      state.updatedAt = Date.now();
      Axios.defaults.headers.post.Authorization = `Bearer ${action.payload}`;
      Axios.defaults.headers.get.Authorization = `Bearer ${action.payload}`;
      Axios.defaults.headers.delete.Authorization = `Bearer ${action.payload}`;
      state.token = action.payload;
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
  setAuthToken,
  setAuthFailed,
  setAuthInvalidated,
} = authSlice.actions;

export default authSlice;
