/* eslint-disable camelcase */
import { CodeSuccess, ApiSucess } from "..";
import { IStep } from "./step";

export interface StepsGet extends ApiSucess {
  err_code: CodeSuccess;
  steps: IStep[];
}

export interface StepGet extends ApiSucess {
  err_code: CodeSuccess;
  step: IStep;
}
