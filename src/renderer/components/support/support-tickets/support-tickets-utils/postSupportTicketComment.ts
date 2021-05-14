import Axios from "axios";
import handlePostCommentST from "../../../../api/handlePostCommentST";
import { ApiError } from "../../../../api/types";
import {
  IPostComment,
  IGetComment,
  IComment,
} from "../../../../api/types/support-ticket/supportTicket";
import { API_URL } from "../../../../constants";

export default function getVoteTicket(
  payload: IPostComment
): Promise<IComment> {
  return new Promise((resolve) => {
    Axios.post<IGetComment | ApiError>(
      `${API_URL}supportComment/create`,
      payload
    )
      .then(handlePostCommentST)
      .then(resolve);
  });
}
