import { IStep } from "../step/step";
import Link from "../link/link";

import constants from "../../constant";

export const DifficultyOptions = {
  Beginner: constants.Difficulty.Beginner,
  Intermediate: constants.Difficulty.Intermediate,
  Advanced: constants.Difficulty.Advanced,
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
  entry: string;
  steps: IStep[];
}
