import { CodeSuccess, ApiSucess } from "..";
import { IStep } from "./step";

/* eslint-disable camelcase */
export default interface StepUpdate extends ApiSucess {
  err_code: CodeSuccess;
  step: IStep;
}
