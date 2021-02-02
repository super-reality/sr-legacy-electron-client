import { CodeSuccess } from "..";
import { IStep } from "./step";

/* eslint-disable camelcase */
export default interface StepCreate {
  err_code: CodeSuccess;
  steps: IStep;
}
