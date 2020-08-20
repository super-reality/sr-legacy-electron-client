import { CodeSuccess } from "..";
import { IStep } from "../step/step";

export interface ILesson {
  subjectId: string;
  icon: string;
  name: string;
  shortDescription: string;
  description: string;
  medias: string[];
  tags: string[];
  visibility: string;
  entry: string;
  steps: IStep[];
}

/* eslint-disable camelcase */
export default interface LessonCreate {
  err_code: CodeSuccess;
  data: ILesson;
}
