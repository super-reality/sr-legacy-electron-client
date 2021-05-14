import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import { IGetComments } from "./types/support-ticket/supportTicket";

export default function handleGetBaseCommentsST(
  res: AxiosResponse<IGetComments | ApiError>
): Promise<IGetComments> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<IGetComments>(res).then(resolve).catch(reject);
  });
}
