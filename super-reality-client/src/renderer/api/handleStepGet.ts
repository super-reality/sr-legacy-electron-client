import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import { StepGet } from "./types/step/get";
import { IStep } from "./types/step/step";
import apiErrorHandler from "./apiErrorHandler";

/* eslint-disable camelcase */
export default function handleStepGet(
  res: AxiosResponse<ApiError | StepGet>
): Promise<IStep> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<StepGet>(res)
      .then((d) => resolve(d.steps))
      .catch(reject);
  });
}
