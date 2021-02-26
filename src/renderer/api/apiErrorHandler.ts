import { AxiosResponse } from "axios";
import { ApiError, ApiSucess } from "./types";

export default function apiErrorHandler<T extends ApiSucess>(
  res: AxiosResponse<T | ApiError>
): Promise<T> {
  return new Promise((resolve, reject) => {
    if (res.status == 200 || res.status == 201) {
      if (res.data.err_code == 0) {
        resolve(res.data);
      } else {
        // Should popup the error to the screen

        reject(res.data.message);
      }
    } else {
      // Should popup the error to the screen
      // eslint-disable-next-line prefer-promise-reject-errors
      reject(`Http error code: ${res.status}`);
    }
  });
}
