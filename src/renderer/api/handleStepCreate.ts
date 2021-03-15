import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import { IStep } from "./types/step/step";
import StepCreate from "./types/step/create";
import apiErrorHandler from "./apiErrorHandler";

export default function handleStepCreate(
  res: AxiosResponse<StepCreate | ApiError>
): Promise<IStep> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<StepCreate>(res)
      .then((d) => resolve(d.steps))
      .catch(reject);
  });
}
