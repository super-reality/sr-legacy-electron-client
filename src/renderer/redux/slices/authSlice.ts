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
  username: "",
  points: 100,
  avatarUrl:
    "https://qph.fs.quoracdn.net/main-qimg-87001d2ce810c2f48c97032cbc905939.webp",
};

type AuthState = typeof initialState;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthPending: (state: AuthState, _action: PayloadAction<null>): void => {
      state.isPending = true;
    },
    setAuthValid: (state: AuthState, action: PayloadAction<boolean>): void => {
      state.isValid = action.payload;
    },
    setAuthSucessful: (
      state: AuthState,
      action: PayloadAction<SignIn>
    ): void => {
      const { firstname, lastname } = action.payload.user;
      state.updatedAt = Date.now();
      if (action.payload.token) {
        const bearer = `Bearer ${action.payload.token}`;
        Axios.defaults.headers.post.Authorization = bearer;
        Axios.defaults.headers.get.Authorization = bearer;
        Axios.defaults.headers.delete.Authorization = bearer;
        Axios.defaults.headers.put.Authorization = bearer;
        state.token = action.payload.token;
        state.username = action.payload.user.username;
      }
      state.name = `${firstname} ${lastname}`;
    },
    setAuthToken: (state: AuthState, action: PayloadAction<string>): void => {
      state.updatedAt = Date.now();
      const bearer = `Bearer ${action.payload}`;
      Axios.defaults.headers.post.Authorization = bearer;
      Axios.defaults.headers.get.Authorization = bearer;
      Axios.defaults.headers.delete.Authorization = bearer;
      Axios.defaults.headers.put.Authorization = bearer;
      state.token = action.payload;
    },
    setAuthFailed: (state: AuthState, _action: PayloadAction<null>): void => {
      state.updatedAt = Date.now();
      state.isValid = false;
      state.isPending = false;
    },
    setAuthInvalidated: (
      state: AuthState,
      _action: PayloadAction<null>
    ): void => {
      state.updatedAt = Date.now();
      state.isValid = false;
      state.isPending = false;
    },
  },
});

export const {
  setAuthValid,
  setAuthPending,
  setAuthSucessful,
  setAuthToken,
  setAuthFailed,
  setAuthInvalidated,
} = authSlice.actions;

export default authSlice;
