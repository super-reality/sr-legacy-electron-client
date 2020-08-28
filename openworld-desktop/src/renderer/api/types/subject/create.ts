import { CodeSuccess } from "..";
import { ISubject } from "./subject";

/* eslint-disable camelcase */
export default interface SubjectCreate {
  err_code: CodeSuccess;
  data: ISubject;
}
