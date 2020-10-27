import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import GenericDelete from "./types/delete";

/* eslint-disable camelcase */
export default function handleGenericDelete(
  res: AxiosResponse<GenericDelete | ApiError>
): Promise<string> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<GenericDelete>(res)
      .then((d) => resolve(d.message))
      .catch(reject);
  });
}
