import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import CollectionGet from "./types/collection/get";

/* eslint-disable camelcase */
export default function handleCollectionGet(
  res: AxiosResponse<CollectionGet | ApiError>
): Promise<CollectionGet> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<CollectionGet>(res)
      .then((d) => resolve(d))
      .catch(reject);
  });
}
