import { ValueOf } from "../../../../types/utils";
import { EntryOptions } from "../lesson/lesson";

export const StatusOptions = {
  Published: 1,
  Draft: 2,
};

export interface ILessonV2 {
  _id: string;
  name: string;
  cost: number;
  status: ValueOf<typeof StatusOptions>;
  description: string;
  entry: ValueOf<typeof EntryOptions>;
  skills: string[];
  difficulty: number;
  media: string[];
  location: any; // parent
  chapters: {
    _id: string;
    name: string;
  }[];
  setupScreenshots: string[];
  setupInstructions: string;
  setupFiles: string[];
}

export interface ILessonV2Get {
  _id: string;
  cost: number;
  status: ValueOf<typeof StatusOptions>;
  description: string;
  entry: ValueOf<typeof EntryOptions>;
  skills: string[];
  difficulty: number;
  media: string[];
  location: any; // parent
  chapters: string[];
  setupScreenshots: string[];
  setupInstructions: string;
  setupFiles: string[];
}
