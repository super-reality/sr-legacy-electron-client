import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import { IDataGet, ICategoriesGet } from "./types/support-ticket/supportTicket";

/* eslint-disable camelcase */
export default function handleChapterGet(
  res: AxiosResponse<ICategoriesGet | ApiError>
): Promise<IDataGet[]> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<ICategoriesGet>(res)
      .then((d) => resolve(d.category))
      .catch(reject);
  });
}
