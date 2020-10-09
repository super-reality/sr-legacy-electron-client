import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import { IStep } from "./types/step/step";
import StepUpdate from "./types/step/update";

/* eslint-disable camelcase */
export default function handleStepUpdate(
  res: AxiosResponse<ApiError | StepUpdate>
): Promise<IStep> {
  return new Promise((resolve, reject) => {
    if (res.status == 200) {
      if (res.data.err_code == 0) {
        resolve(res.data.step);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}
