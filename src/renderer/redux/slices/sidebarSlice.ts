/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IsidebarSlice {
  width: number;
}

const initialState: IsidebarSlice = {
  width: 0,
};

const sidebarSlice = createSlice({
  name: "sidebarSlice",
  initialState,
  reducers: {
    setWidth: (
      state: IsidebarSlice,
      action: PayloadAction<IsidebarSlice>
    ): void => {
      state = Object.assign(state, action.payload);
    },
  },
});

export const { setWidth } = sidebarSlice.actions;

export default sidebarSlice;
