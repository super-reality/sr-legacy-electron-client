import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import { IAnchor } from "./types/anchor/anchor";
import AnchorUpdate from "./types/anchor/update";

/* eslint-disable camelcase */
export default function handleAnchorUpdate(
  res: AxiosResponse<AnchorUpdate | ApiError>
): Promise<IAnchor> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<AnchorUpdate>(res)
      .then((d) => resolve(d.anchor))
      .catch(reject);
  });
}
