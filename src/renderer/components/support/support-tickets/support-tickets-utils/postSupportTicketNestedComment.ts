import Axios from "axios";
import handlePostCommentST from "../../../../api/handlePostCommentST";
import { ApiError } from "../../../../api/types";
import {
  IPostNestedComment,
  IGetComment,
  IComment,
} from "../../../../api/types/support-ticket/supportTicket";
import { API_URL } from "../../../../constants";

export default function getVoteTicket(
  payload: IPostNestedComment
): Promise<IComment> {
  return new Promise((resolve) => {
    Axios.post<IGetComment | ApiError>(
      `${API_URL}supportNestedComment/create`,
      payload
    )
      .then(handlePostCommentST)
      .then(resolve);
  });
}
