/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import supportTicket from "../../api/types/support-ticket/supportTicket";

const initialState: supportTicket = {
  supportType: "",
  title: "",
  category: "",
  skills: [],
  description: "",
  images: [],
  newSkill: false,
  newSkills: [],
  newCategory: false,
  newCategoryName: "",
  skillsData: [],
  searchedSkills: [],
  categoryData: [],
  subcategories: [],
  vibes: [],
  vibeData: { positiveVibes: [], negativeVibes: [] },
};

const createSupportTicketSlice = createSlice({
  name: "createSupportTicket",
  initialState,
  reducers: {
    setData: (
      state: supportTicket,
      action: PayloadAction<Partial<supportTicket>>
    ): void => {
      state = Object.assign(state, action.payload);
    },
    reset: (state: supportTicket, _action: PayloadAction<null>): void => {
      state = Object.assign(state, initialState);
      state.images = [];
      state.skills = [];
      state.newSkills = [];
    },
  },
});

export const {
  setData,
  reset /* , addImages  */,
} = createSupportTicketSlice.actions;

export default createSupportTicketSlice;
