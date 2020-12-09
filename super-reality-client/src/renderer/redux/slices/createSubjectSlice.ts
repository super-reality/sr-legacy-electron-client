/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISubject } from "../../api/types/subject/subject";
import { EntryOptions } from "../../api/types/lesson/lesson";
import { ITag } from "../../components/tag-box";

const initialState: ISubject = {
  _id: undefined,
  parent: [],
  icon: "",
  name: "",
  shortDescription: "",
  description: "",
  medias: [],
  tags: [],
  visibility: [],
  entry: EntryOptions.Open,
};

const createSubjectSlice = createSlice({
  name: "createSubject",
  initialState,
  reducers: {
    setData: (
      state: ISubject,
      action: PayloadAction<Partial<ISubject>>
    ): void => {
      state = Object.assign(state, action.payload);
    },
    addTag: (state: ISubject, action: PayloadAction<ITag>): void => {
      state.tags = [...state.tags, action.payload];
    },
    reset: (state: ISubject, _action: PayloadAction<null>): void => {
      state = Object.assign(state, initialState);
      state.parent = [];
      state.tags = [];
      state.medias = [];
      state.visibility = [];
    },
  },
});

export const { setData, addTag, reset } = createSubjectSlice.actions;

export default createSubjectSlice;
