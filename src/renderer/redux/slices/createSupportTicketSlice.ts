/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import supportTicker from "../../api/types/support-ticket/supportTicket";

const initialState: supportTicker = {
  supportType: "",
  title: "",
  category: "",
  skills: [],
  description: "",
  images: [],
  newSkill: false,
  newSkillName: "",
  newCategory: false,
  newCategoryName: "",
  skillsData: [],
  searchedSkills: [],
  categoryData: [],
  supportScreen: 0,
};

const createSupportTicketSlice = createSlice({
  name: "createSupportTicket",
  initialState,
  reducers: {
    setData: (
      state: supportTicker,
      action: PayloadAction<supportTicker>
    ): void => {
      state = Object.assign(state, action.payload);
    },
    reset: (state: supportTicker, _action: PayloadAction<null>): void => {
      state = Object.assign(state, initialState);
      state.images = [];
      state.skills = [];
    },
  },
});

export const {
  setData,
  reset /* , addImages  */,
} = createSupportTicketSlice.actions;

export default createSupportTicketSlice;
