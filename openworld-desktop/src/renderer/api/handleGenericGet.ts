import { AxiosResponse } from "axios";
import { ApiError, ApiSucess } from "./types";

/* eslint-disable camelcase */
export default function handleGenericGet<T extends ApiSucess>(
  res: AxiosResponse<ApiError | T>
): Promise<T> {
  return new Promise((resolve, reject) => {
    if (res.status == 200) {
      if (res.data.err_code == 0) {
        resolve(res.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}
