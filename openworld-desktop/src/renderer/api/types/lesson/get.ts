import { CodeSuccess, ApiSucess } from "..";
import { IStep } from "../step/step";
import Link from "../link/link";
import { Subject } from "./search-parent";

export interface ILessonGet {
  parent: Subject[];
  medias: string[];
  totalSteps: IStep[]; // Actually IStepGet
  tags: Link[];
  visibility: Link[];
  ownership: Link[];
  options: [];
  _id: string;
  createdAt: string;
  icon: string;
  name: string;
  shortDescription: string;
  description: string;
  difficulty: number;
  entry: number;
  rating: number;
  ratingCount: number;
  numberOfShares: number;
  numberOfActivations: number;
  numberOfCompletions: number;
  createdBy: string;
}

/* eslint-disable camelcase */
export default interface LessonGet extends ApiSucess {
  err_code: CodeSuccess;
  lesson: ILessonGet;
}
