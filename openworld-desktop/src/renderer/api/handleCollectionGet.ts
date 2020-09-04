import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import CollectionGet from "./types/collection/get";

/* eslint-disable camelcase */
export default function handleCollectionGet(
  res: AxiosResponse<ApiError | CollectionGet>
): Promise<CollectionGet> {
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
