import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import { StepGet } from "./types/step/get";
import { IStep } from "./types/step/step";

/* eslint-disable camelcase */
export default function handleStepGet(
  res: AxiosResponse<ApiError | StepGet>
): Promise<IStep> {
  return new Promise((resolve, reject) => {
    if (res.status == 200) {
      if (res.data.err_code == 0) {
        resolve(res.data.steps);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}
