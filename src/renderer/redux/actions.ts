import * as AuthSlice from "./slices/authSlice";
import * as renderSlice from "./slices/renderSlice";
import * as createLessonSliceV2 from "./slices/createLessonSliceV2";
import * as commonPropSlice from "./slices/commonPropSlice";
import * as userDataSlice from "./slices/userDataSlice";
import * as settingsSlice from "./slices/settingsSlice";
import * as backgroundSlice from "./slices/backgroundSlice";
import * as lessonPlayerSlice from "./slices/lessonPlayerSlice";
import * as chatSlice from "./slices/chatSlice";
import * as createSupportTicketSlice from "./slices/createSupportTicketSlice";

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
  SET_CV_RESULT: renderSlice.setCvResult,
  SET_READY: renderSlice.setReady,
  SET_APP_MODE: renderSlice.setAppMode,
  SET_TOPMOST: renderSlice.setTopMost,
  CLEAR_RECORDING_CV_DATA: createLessonSliceV2.clearRecordingCVData,
  SET_RECORDING_CV_DATA: createLessonSliceV2.setRecordingCVData,
  SET_RECORDING_DATA: createLessonSliceV2.setRecordingData,
  CREATE_LESSON_V2_DATA: createLessonSliceV2.setData,
  CREATE_LESSON_V2_TREE: createLessonSliceV2.setOpenTree,
  CREATE_LESSON_V2_DRAG: createLessonSliceV2.setDrag,
  CREATE_LESSON_V2_DRAGOVER: createLessonSliceV2.setDragOver,
  CREATE_LESSON_V2_MOVE: createLessonSliceV2.doMove,
  CREATE_LESSON_V2_CUT: createLessonSliceV2.doCut,
  CREATE_LESSON_V2_DELETE: createLessonSliceV2.doDelete,
  CREATE_LESSON_V2_SELECT: createLessonSliceV2.selectEvent,
  CREATE_LESSON_V2_SETLESSON: createLessonSliceV2.setLesson,
  CREATE_LESSON_V2_SETCHAPTER: createLessonSliceV2.setChapter,
  CREATE_LESSON_V2_SETSTEP: createLessonSliceV2.setStep,
  CREATE_LESSON_V2_SETITEM: createLessonSliceV2.setItem,
  CREATE_LESSON_V2_SET_TEMPITEM: createLessonSliceV2.setTempItem,
  CREATE_LESSON_V2_SETANCHOR: createLessonSliceV2.setAnchor,
  CREATE_LESSON_V2_DELETEANCHOR: createLessonSliceV2.deleteAnchor,
  CREATE_LESSON_V2_TRIGGER_CV_MATCH: createLessonSliceV2.doTriggerCvMatch,
  SET_LOADING_STATE: commonPropSlice.setIsLoading,
  SET_DETACHED: commonPropSlice.setDetached,
  SET_BACKGROUND: commonPropSlice.setBackground,
  USERDATA_RESET: userDataSlice.clearUserData,
  USERDATA_TOGGLE_LESSON: userDataSlice.toggleLesson,
  USERDATA_SET_LESSONS: userDataSlice.setLessons,
  RESET: userDataSlice.reset,
  CLEAR_SETTINGS: settingsSlice.clearsettings,
  SET_SETTINGS: settingsSlice.setSettings,
  SET_CV_SETTINGS: settingsSlice.setCVSettings,
  SET_BACK: backgroundSlice.setData,
  SET_LESSON_PLAYER_DATA: lessonPlayerSlice.setLessonPlayerData,
  RESET_LESSON_PLAYER: lessonPlayerSlice.reset,
  SET_LESSON_PLAYING: lessonPlayerSlice.setPlaying,
  SET_TTS: lessonPlayerSlice.setTTS,
  LOGIN_CHAT_SUCCES: chatSlice.loginChatSucces,
  LOGIN_CHAT_ERROR: chatSlice.loginChatError,
  SET_MESSAGES: chatSlice.setMessages,
  UPDATE_MESSAGE: chatSlice.updateMessage,
  DELETE_MESSAGES: chatSlice.deleteMessage,
  SET_USERS: chatSlice.setUsers,
  UPDATE_CHAT_USERS: chatSlice.updateChatUsers,
  DELETE_CHAT_USER: chatSlice.deleteUser,
  SET_GROUPS: chatSlice.setGroups,
  ADD_GROUP: chatSlice.addNewGroup,
  UPDATE_GROUP: chatSlice.updateGroup,
  DELETE_GROUP: chatSlice.deleteGroup,
  SET_ACTIVE_GROUP: chatSlice.setActiveGroup,
  SET_CHAT_LOGIN_DATA: chatSlice.setChatLoginData,
  SET_SUPPORT_TICKET: createSupportTicketSlice.setData,
  /*   SET_IMAGES_SUPPORT_TICKET:createSupportTicketSlice.addImages, */
  SUPPORT_TICKET_RESET: createSupportTicketSlice.reset,
  SET_CHANNELS: chatSlice.setChannnels,
  UPDATE_CHANNEL: chatSlice.updateChannel,
  DELETE_CHANNEL: chatSlice.deleteChannel,
  ADD_CHANNEL: chatSlice.addNewChannel,
  SET_ACTIVE_CHANNEL: chatSlice.setActiveChannel,
};

export type ActionKeys = keyof typeof actions;
