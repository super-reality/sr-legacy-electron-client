import { IStep } from "../step/step";
import Link from "../link/link";

import constant from "../../constant";

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
  parent: Link[];
  icon: string;
  name: string;
  shortDescription: string;
  description: string;
  difficulty: number;
  medias: string[];
  tags: string[];
  visibility: Link[];
  ownership: Link[];
  entry: number;
  steps: IStep[];
}
