import { CodeSuccess } from "..";
import { ILessonV2 } from "./lesson";

/* eslint-disable camelcase */
export default interface LessonV2Create {
  err_code: CodeSuccess;
  lesson: ILessonV2;
}
