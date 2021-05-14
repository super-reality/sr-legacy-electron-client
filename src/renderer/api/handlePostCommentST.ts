import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import { IGetComment, IComment } from "./types/support-ticket/supportTicket";

export default function handlePostCommentST(
  res: AxiosResponse<IGetComment | ApiError>
): Promise<IComment> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<IGetComment>(res)
      .then((c) => resolve(c.comment))
      .catch(reject);
  });
}
