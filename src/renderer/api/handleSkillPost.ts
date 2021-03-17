import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import { ISkill, ISkillGet } from "./types/support-ticket/supportTicket";

/* eslint-disable camelcase */
export default function handleChapterGet(
  res: AxiosResponse<ISkillGet | ApiError>
): Promise<ISkill> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<ISkillGet>(res).then(resolve).catch(reject);
  });
}
