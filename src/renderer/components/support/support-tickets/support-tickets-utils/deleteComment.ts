import Axios from "axios";
import handleGetBaseCommentsST from "../../../../api/handleGetBaseCommentsST";
import { ApiError } from "../../../../api/types";
import {
  IGetComments,
  IDeleteComment,
} from "../../../../api/types/support-ticket/supportTicket";
import { API_URL } from "../../../../constants";

export default function getVoteTicket(
  payload: IDeleteComment
): Promise<IGetComments> {
  return new Promise((resolve) => {
    Axios.delete<IGetComments | ApiError>(
      `${API_URL}supportComment/${payload._id}`,
      { data: { parentId: payload.parentId } }
    )
      .then(handleGetBaseCommentsST)
      .then(resolve);
  });
}
