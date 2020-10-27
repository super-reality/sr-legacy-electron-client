import { CodeSuccess, ApiSucess } from "..";
import { ILessonV2 } from "./lesson";

/* eslint-disable camelcase */
export default interface LessonGet extends ApiSucess {
  err_code: CodeSuccess;
  lessons: ILessonV2;
}
