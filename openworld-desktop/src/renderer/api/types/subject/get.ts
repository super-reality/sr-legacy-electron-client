import { CodeSuccess } from "..";
import Link from "../link/link";
import { ILessonGet } from "../lesson/get";

export interface ISubjectGet {
  parent: Link[];
  tags: string[];
  medias: string[];
  visibility: [];
  options: Link[];
  _id: string;
  createdAt: string;
  icon: string;
  name: string;
  shortDescription: string;
  description: string;
  entry: number;
  numberOfShares: number;
  numberOfActivations: number;
  numberOfCompletions: number;
  createdBy: string;
}

/* eslint-disable camelcase */
export default interface SubjectGet {
  err_code: CodeSuccess;
  subject: ISubjectGet;
  lessons: ILessonGet[];
}
