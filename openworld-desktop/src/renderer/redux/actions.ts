import * as AuthSlice from "./slices/authSlice";
import * as renderSlice from "./slices/renderSlice";

export const actions = {
  AUTH_PENDING: AuthSlice.setAuthPending,
  AUTH_SUCCESSFUL: AuthSlice.setAuthSucessful,
  AUTH_FAILED: AuthSlice.setAuthFailed,
  AUTH_INVALIDATED: AuthSlice.setAuthInvalidated,
  SET_YSCROLL: renderSlice.setYScroll,
};

export type ActionKeys = keyof typeof actions;
