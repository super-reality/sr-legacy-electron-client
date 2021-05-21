/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CollectiveAI,
  CollectiveAIType,
} from "../../api/types/collective-ai/create-collective-ai";

// export type CollectiveAIType =
//   | "software"
//   | "people"
//   | "public person"
//   | "insitution"
//   | "animal"
//   | "plant"
//   | "object";

// export interface CollectiveAI {
//   name: string;
//   type: CollectiveAIType;
//   personality: string[];
//   skills: string[];
//   goals: string[];
//   parragraph: string;
//   icon: string;
// }

const initialState: CollectiveAI = {
  name: "",
  type: "" as CollectiveAIType,
  personality: [],
  skills: [],
  goals: [],
  paragraph: "",
  icon: "",
};

type InitialState = typeof initialState;

const createCollectiveAISlice = createSlice({
  name: "createAICollectiveSlice",
  initialState,
  reducers: {
    setCollectiveAiData: (
      state: InitialState,
      action: PayloadAction<Partial<CollectiveAI>>
    ): void => {
      state = Object.assign(state, action.payload);
    },
    resetCollectiveAiForm: (
      state: InitialState,
      _action: PayloadAction<null>
    ): void => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      state = Object.assign(state, initialState);
    },
  },
});
export const {
  setCollectiveAiData,
  resetCollectiveAiForm,
} = createCollectiveAISlice.actions;

export default createCollectiveAISlice;
