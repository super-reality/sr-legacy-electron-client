import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import { IStep } from "./types/step/step";
import StepCreate from "./types/step/create";

export default function handleStepCreate(
  res: AxiosResponse<StepCreate | ApiError>
): Promise<IStep> {
  return new Promise((resolve, reject) => {
    if (res.status == 200 && res.data.err_code == 0) {
      resolve(res.data.steps);
    } else {
      reject();
    }
  });
}
