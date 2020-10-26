import { CodeSuccess, ApiSucess } from "..";
import { ILessonV2 } from "./lesson";

/* eslint-disable camelcase */
export default interface LessonUpdate extends ApiSucess {
  err_code: CodeSuccess;
  lesson: ILessonV2;
}
