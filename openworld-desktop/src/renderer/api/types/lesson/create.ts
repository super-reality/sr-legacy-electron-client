import { CodeSuccess } from "..";
import { ILesson } from "./lesson";

/* eslint-disable camelcase */
export default interface LessonCreate {
  err_code: CodeSuccess;
  data: ILesson;
}
