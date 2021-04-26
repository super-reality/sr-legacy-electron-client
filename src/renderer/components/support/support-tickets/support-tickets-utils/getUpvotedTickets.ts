import Axios from "axios";
import handleGetUpvotedTickets from "../../../../api/handleGetUpvotedTickets";
import { ApiError } from "../../../../api/types";
import { IGetUpvotedTickets } from "../../../../api/types/support-ticket/supportTicket";
import { API_URL } from "../../../../constants";

export default function searchSupportTickets(): Promise<IGetUpvotedTickets> {
  return new Promise((resolve, reject) => {
    Axios.post<IGetUpvotedTickets | ApiError>(`${API_URL}support/votes`)
      .then(handleGetUpvotedTickets)
      .then(resolve)
      .catch(reject);
  });
}
