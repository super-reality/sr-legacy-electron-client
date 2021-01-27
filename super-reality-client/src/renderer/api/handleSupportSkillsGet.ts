import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import { IDataGet, ISkillsGet } from "./types/support-ticket/supportTicket";

/* eslint-disable camelcase */
// hola
export default function handleChapterGet(
  res: AxiosResponse<ISkillsGet | ApiError>
): Promise<IDataGet[]> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<ISkillsGet>(res)
      .then((d) => resolve(d.skill))
      .catch(reject);
  });
}
