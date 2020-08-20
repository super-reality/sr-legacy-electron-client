import { CodeSuccess } from "..";
import { CreateLessonState } from "../../../redux/slices/createLessonSlice";

/* eslint-disable camelcase */
export default interface CreateLesson {
  err_code: CodeSuccess;
  data: CreateLessonState;
}
