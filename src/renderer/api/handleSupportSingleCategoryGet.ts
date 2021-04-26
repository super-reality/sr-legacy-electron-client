import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import { ISingleCategoryGet } from "./types/support-ticket/supportTicket";

/* eslint-disable camelcase */
export default function handleSupportSingleCategoryGet(
  res: AxiosResponse<ISingleCategoryGet | ApiError>
): Promise<ISingleCategoryGet["category"]> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<ISingleCategoryGet>(res)
      .then((d) => resolve(d.category))
      .catch(reject);
  });
}
