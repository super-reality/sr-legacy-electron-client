import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import { AnchorGet } from "./types/anchor/get";
import { IAnchor } from "./types/anchor/anchor";
import apiErrorHandler from "./apiErrorHandler";

/* eslint-disable camelcase */
export default function handleAnchorGet(
  res: AxiosResponse<ApiError | AnchorGet>
): Promise<IAnchor> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<AnchorGet>(res)
      .then((d) => resolve(d.anchor))
      .catch(reject);
  });
}
