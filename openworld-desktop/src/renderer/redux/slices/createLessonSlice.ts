/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IStep } from "../../api/types/step/step";
import {
  ILesson,
  EntryOptions,
  DifficultyOptions,
} from "../../api/types/lesson/lesson";
import { ITag } from "../../components/tag-box";

const initialState: ILesson = {
  _id: undefined,
  parent: [],
  difficulty: DifficultyOptions.Intermediate,
  ownership: [],
  tags: [],
  icon: "",
  name: "",
  shortDescription: "",
  description: "",
  medias: [],
  visibility: [],
  entry: EntryOptions.Invite,
  steps: [],
};

const createLessonSlice = createSlice({
  name: "createLesson",
  initialState,
  reducers: {
    setData: (
      state: ILesson,
      action: PayloadAction<Partial<ILesson>>
    ): void => {
      state = Object.assign(state, action.payload);
    },
    addTag: (state: ILesson, action: PayloadAction<ITag>): void => {
      state.tags = [...state.tags, action.payload];
    },
    addStep: (state: ILesson, action: PayloadAction<IStep>): void => {
      state.steps = [...state.steps, action.payload];
    },
    reset: (state: ILesson, action: PayloadAction<null>): void => {
      state = Object.assign(state, initialState);
      state.parent = [];
      state.ownership = [];
      state.tags = [];
      state.medias = [];
      state.visibility = [];
      state.steps = [];
    },
  },
});

export const { setData, addTag, addStep, reset } = createLessonSlice.actions;

export default createLessonSlice;
