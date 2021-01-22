import { IStep } from "../step-old/step";
import Link from "../link/link";

import constant from "../../constant";
import { ITag } from "../../../components/tag-box";

export const DifficultyOptions = {
  Intro: constant.Difficulty.Intro,
  Beginner: constant.Difficulty.Beginner,
  Intermediate: constant.Difficulty.Intermediate,
  Advanced: constant.Difficulty.Advanced,
};

export const EntryOptions = {
  Open: constant.Entry.Open,
  Invite: constant.Entry.Invite,
};

export interface ILesson {
  _id?: string;
  parent: ITag[];
  icon: string;
  name: string;
  shortDescription: string;
  description: string;
  difficulty: number;
  medias: string[];
  tags: ITag[];
  visibility: Link[];
  ownership: Link[];
  entry: number;
  steps: IStep[];
}
