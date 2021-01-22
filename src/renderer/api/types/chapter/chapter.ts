import { IDName } from "..";

export interface IChapter {
  _id: string;
  name: string;
  steps: IDName[];
}
