/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICollection } from "../../api/types/collection/collection";
import { EntryOptions } from "../../api/types/lesson/lesson";
import { ITag } from "../../components/tag-box";

const initialState: ICollection = {
  _id: undefined,
  icon: "",
  name: "",
  shortDescription: "",
  description: "",
  medias: [],
  tags: [],
  visibility: [],
  entry: EntryOptions.Open,
};

const createCollectionSlice = createSlice({
  name: "createCollection",
  initialState,
  reducers: {
    setData: (
      state: ICollection,
      action: PayloadAction<Partial<ICollection>>
    ): void => {
      state = Object.assign(state, action.payload);
    },
    addTag: (state: ICollection, action: PayloadAction<ITag>): void => {
      state.tags = [...state.tags, action.payload];
    },
    reset: (state: ICollection, _action: PayloadAction<null>): void => {
      state = Object.assign(state, initialState);
      state.medias = [];
      state.tags = [];
      state.visibility = [];
    },
  },
});

export const { setData, addTag, reset } = createCollectionSlice.actions;

export default createCollectionSlice;
