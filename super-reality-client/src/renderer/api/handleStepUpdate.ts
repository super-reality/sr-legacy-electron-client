import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import { IStep } from "./types/step/step";
import StepUpdate from "./types/step/update";

/* eslint-disable camelcase */
export default function handleStepUpdate(
  res: AxiosResponse<StepUpdate | ApiError>
): Promise<IStep> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<StepUpdate>(res)
      .then((d) => resolve(d.step))
      .catch(reject);
  });
}
