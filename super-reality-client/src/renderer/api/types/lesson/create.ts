import { CodeSuccess } from "..";
import { ILesson } from "./lesson";

/* eslint-disable camelcase */
export default interface LessonCreate {
  err_code: CodeSuccess;
  data: ILesson;
}

/* eslint-disable camelcase */

export interface LessonResp {
  err_code: CodeSuccess;
  lesson: { _id: string; medias: string[]; icon: string };
  status: number;
}
