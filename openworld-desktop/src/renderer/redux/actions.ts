import * as AuthSlice from "./slices/authSlice";
import * as renderSlice from "./slices/renderSlice";
import * as createCollectionSlice from "./slices/createCollectionSlice";
import * as createSubjectSlice from "./slices/createSubjectSlice";
import * as createLessonSlice from "./slices/createLessonSlice";
import * as createStepSlice from "./slices/createStepSlice";
import * as commonPropSlice from "./slices/commonPropSlice";
import * as userDataSlice from "./slices/userDataSlice";
import * as settingsSlice from "./slices/settingsSlice";

export const actions = {
  AUTH_PENDING: AuthSlice.setAuthPending,
  AUTH_VALID: AuthSlice.setAuthValid,
  AUTH_SUCCESSFUL: AuthSlice.setAuthSucessful,
  AUTH_TOKEN: AuthSlice.setAuthToken,
  AUTH_FAILED: AuthSlice.setAuthFailed,
  AUTH_INVALIDATED: AuthSlice.setAuthInvalidated,
  SET_YSCROLL: renderSlice.setYScroll,
  SET_YSCROLL_MOVE: renderSlice.setYScrollMoveTo,
  SET_TOP_INPUT: renderSlice.setTopInput,
  CREATE_LESSON_DATA: createLessonSlice.setData,
  CREATE_LESSON_TAG: createLessonSlice.addTag,
  CREATE_LESSON_STEP: createLessonSlice.addStep,
  CREATE_LESSON_STEP_REPLACE: createLessonSlice.replaceStep,
  CREATE_LESSON_RESET: createLessonSlice.reset,
  CREATE_STEP_DATA: createStepSlice.setData,
  CREATE_STEP_RESET: createStepSlice.reset,
  CREATE_COLLECTION_DATA: createCollectionSlice.setData,
  CREATE_COLLECTION_TAG: createCollectionSlice.addTag,
  CREATE_COLLECTION_RESET: createCollectionSlice.reset,
  CREATE_SUBJECT_DATA: createSubjectSlice.setData,
  CREATE_SUBJECT_TAG: createSubjectSlice.addTag,
  CREATE_SUBJECT_RESET: createSubjectSlice.reset,
  SET_LOADING_STATE: commonPropSlice.setIsLoading,
  SET_DETACHED: commonPropSlice.setDetached,
  USERDATA_RESET: userDataSlice.clearUserData,
  USERDATA_TOGGLE_COLLECTION: userDataSlice.toggleCollection,
  USERDATA_TOGGLE_SUBJECT: userDataSlice.toggleSubject,
  USERDATA_TOGGLE_LESSON: userDataSlice.toggleLesson,
  CLEAR_SETTINGS: settingsSlice.clearsettings,
  SET_SETTINGS: settingsSlice.setSettings,
  SET_CV_SETTINGS: settingsSlice.setCVSettings,
};

export type ActionKeys = keyof typeof actions;
