import Axios from "axios";
import handleGetBaseCommentsST from "../../../../api/handleGetBaseCommentsST";
import { ApiError } from "../../../../api/types";
import { IGetComments } from "../../../../api/types/support-ticket/supportTicket";
import { API_URL } from "../../../../constants";

export default function getVoteTicket(ticketId: string): Promise<IGetComments> {
  return new Promise((resolve) => {
    Axios.get<IGetComments | ApiError>(`${API_URL}supportComment/${ticketId}`)
      .then(handleGetBaseCommentsST)
      .then(resolve);
  });
}
