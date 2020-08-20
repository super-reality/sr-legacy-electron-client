import * as AuthSlice from "./slices/authSlice";
import * as renderSlice from "./slices/renderSlice";
import * as createLessonSlice from "./slices/createLessonSlice";

export const actions = {
  AUTH_PENDING: AuthSlice.setAuthPending,
  AUTH_SUCCESSFUL: AuthSlice.setAuthSucessful,
  AUTH_FAILED: AuthSlice.setAuthFailed,
  AUTH_INVALIDATED: AuthSlice.setAuthInvalidated,
  SET_YSCROLL: renderSlice.setYScroll,
  SET_TOP_SELECT: renderSlice.setTopSelect,
  SET_TOP_INPUT: renderSlice.setTopInput,
  CREATE_LESSON_DATA: createLessonSlice.setData,
  CREATE_LESSON_TAG: createLessonSlice.addTag,
  CREATE_LESSON_STEP: createLessonSlice.addStep,
  CREATE_LESSON_RESET: createLessonSlice.reset,
};

export type ActionKeys = keyof typeof actions;
