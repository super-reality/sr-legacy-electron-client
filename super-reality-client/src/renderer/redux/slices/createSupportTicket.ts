import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import supportTicker from "../../api/types/support-ticket/supportTicket";

const initialState: supportTicker = {
  category: {
    name: "",
  },
  option: {
    name: "",
    description: "",
  },
  title: "",
  requestCategory: {
    name: "",
    tags: [],
  },
  description: "",
  skills: {
    name: "",
    tags: [],
  },

  file: "",
};

const createSupportTicketSlice = createSlice({
    name:"createSupportTicket",
    initialState,
    reducers: {
        setData:(
            state:supportTicker,
            action:PayloadAction<supportTicker>
        ):void => {state = Object.assign(state, action.payload);},

        reset: (state: supportTicker, _action: PayloadAction<null>): void => {
            state = Object.assign(state, initialState);
            state.requestCategory.tags = [];
            state.skills.tags = [];
          },
    }
});

export const { setData, reset } = createSupportTicketSlice.actions;

export default createSupportTicketSlice;

