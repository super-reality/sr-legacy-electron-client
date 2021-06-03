import Axios from "axios";
import handleCommentEditST from "../../../../api/handleCommentEditST";
import { ApiError } from "../../../../api/types";
import {
  IGetComment,
  IEditComment,
} from "../../../../api/types/support-ticket/supportTicket";
import { API_URL } from "../../../../constants";

export default function editComment(
  payload: IEditComment
): Promise<IGetComment> {
  return new Promise((resolve) => {
    if (payload.comment || payload.votes) {
      Axios.put<IGetComment | ApiError>(
        `${API_URL}supportComment/${payload._id}`,
        { ...payload }
      )
        .then(handleCommentEditST)
        .then(resolve);
    }
  });
}
