import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import GenericDelete from "./types/delete";

/* eslint-disable camelcase */
export default function handleGenericDelete(
  res: AxiosResponse<ApiError | GenericDelete>
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (res.status == 200) {
      if (res.data.err_code == 0) {
        resolve(res.data.message);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}
