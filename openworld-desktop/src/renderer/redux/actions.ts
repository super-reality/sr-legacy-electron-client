import * as AuthSlice from "./slices/authSlice";

export const actions = {
  AUTH_PENDING: AuthSlice.setAuthPending,
  AUTH_SUCCESSFUL: AuthSlice.setAuthSucessful,
  AUTH_FAILED: AuthSlice.setAuthFailed,
  AUTH_INVALIDATED: AuthSlice.setAuthInvalidated,
};

export type ActionKeys = keyof typeof actions;
