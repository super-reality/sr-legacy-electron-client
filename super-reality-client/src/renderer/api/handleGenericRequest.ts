import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError, ApiSucess } from "./types";

/* eslint-disable camelcase */
export default function handleGenericGet<T extends ApiSucess>(
  res: AxiosResponse<T | ApiError>
): Promise<T> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<T>(res)
      .then((d) => resolve(d))
      .catch(reject);
  });
}
