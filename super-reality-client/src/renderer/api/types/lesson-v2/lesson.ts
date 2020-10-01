import { ValueOf } from "../../../../types/utils";
import { EntryOptions } from "../lesson/lesson";
import { Item } from "./item";

export const StatusOptions = {
  Published: 1,
  Draft: 2,
};

export interface IAnchor {
  _id: string;
  name: string;
  type: "record" | "crop" | "url";
  templates: string[];
  function: "or" | "and";
  cvMatchValue: number;
  cvCanvas: number;
  cvDelay: number;
  cvGrayscale: boolean;
  cvApplyThreshold: boolean;
  cvThreshold: number;
}

export interface IChapter {
  _id: string;
  name: string;
  steps: {
    _id: string;
    name: string;
  }[];
}

export interface IChapterGet {
  _id: string;
  name: string;
  steps: string[];
}

export interface IStep {
  _id: string;
  name: string;
  items: {
    _id: string;
    name: string;
  }[];
}

export interface IStepGet {
  _id: string;
  name: string;
  items: string[];
}

export interface ILessonV2 {
  _id: string;
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
