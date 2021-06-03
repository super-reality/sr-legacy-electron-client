import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import { IGetComment } from "./types/support-ticket/supportTicket";

export default function handleGetBaseCommentsST(
  res: AxiosResponse<IGetComment | ApiError>
): Promise<IGetComment> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<IGetComment>(res).then(resolve).catch(reject);
  });
}
