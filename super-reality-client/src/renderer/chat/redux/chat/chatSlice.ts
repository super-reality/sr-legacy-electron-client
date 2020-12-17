import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  channels: {
    channels: {},
    limit: 5,
    skip: 0,
    total: 0,
    updateNeeded: true,
  },
  targetObjectType: "",
  targetObject: {},
  targetChannelId: "",
  updateMessageScroll: false,
  messageScrollInit: false,
  instanceChannelFetching: false,
  instanceChannelFetched: false,
};

type ChatState = typeof initialState;

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
});

export default chatSlice;
