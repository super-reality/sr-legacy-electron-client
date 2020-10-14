import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import { IAnchor } from "./types/anchor/anchor";
import AnchorCreate from "./types/anchor/create";
import apiErrorHandler from "./apiErrorHandler";

export default function handleAnchorCreate(
  res: AxiosResponse<AnchorCreate | ApiError>
): Promise<IAnchor> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<AnchorCreate>(res)
      .then((d) => resolve(d.anchor))
      .catch(reject);
  });
}
