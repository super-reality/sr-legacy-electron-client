import Axios from "axios";
import handleSupportTicketVote from "../../../../api/handleSupportTicketVote";
import { ApiError } from "../../../../api/types";
import {
  singleSupportTicketsGet,
  IVotePayload,
} from "../../../../api/types/support-ticket/supportTicket";
import { API_URL } from "../../../../constants";

export default function getVoteTicket(
  id: string,
  payload: IVotePayload
): Promise<null> {
  return new Promise((resolve) => {
    Axios.put<singleSupportTicketsGet | ApiError>(
      `${API_URL}support/vote/${id}`,
      payload
    )
      .then(handleSupportTicketVote)
      .then(resolve);
  });
}
