import * as AuthSlice from "./slices/authSlice";
import * as renderSlice from "./slices/renderSlice";
import * as createLessonSlice from "./slices/createLessonSlice";
import * as createCollectionSlice from "./slices/createCollectionSlice";
import * as createSubjectSlice from "./slices/createSubjectSlice";
import * as commonPropSlice from "./slices/commonProps";

export const actions = {
  AUTH_PENDING: AuthSlice.setAuthPending,
  AUTH_SUCCESSFUL: AuthSlice.setAuthSucessful,
  AUTH_TOKEN: AuthSlice.setAuthToken,
  AUTH_FAILED: AuthSlice.setAuthFailed,
  AUTH_INVALIDATED: AuthSlice.setAuthInvalidated,
  SET_YSCROLL: renderSlice.setYScroll,
  SET_TOP_INPUT: renderSlice.setTopInput,
  CREATE_LESSON_DATA: createLessonSlice.setData,
  CREATE_LESSON_TAG: createLessonSlice.addTag,
  CREATE_LESSON_STEP: createLessonSlice.addStep,
  CREATE_LESSON_RESET: createLessonSlice.reset,
  CREATE_COLLECTION_DATA: createCollectionSlice.setData,
  CREATE_COLLECTION_TAG: createCollectionSlice.addTag,
  CREATE_COLLECTION_RESET: createCollectionSlice.reset,
  CREATE_SUBJECT_DATA: createSubjectSlice.setData,
  CREATE_SUBJECT_TAG: createSubjectSlice.addTag,
  CREATE_SUBJECT_RESET: createSubjectSlice.reset,
  SET_LOADING_STATE: commonPropSlice.setIsLoading,
};

export type ActionKeys = keyof typeof actions;
