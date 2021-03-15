import { IDName } from "..";
import { ValueOf } from "../../../../types/utils";

export const EntryOptions = {
  Open: 1,
  Invite: 2,
};

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
  location: any;
  chapters: IDName[];
  setupScreenshots: string[];
  setupInstructions: string;
  setupFiles: string[];
  visibility: number;
}
