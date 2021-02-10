import Axios from "axios";
import handleSupportTicketsGet from "../../../api/handleSupportTicketsGet";
import { ApiError } from "../../../api/types";
import {
  ISearchSupportTickets,
  supportTicketsGet,
  supportTicketPayload,
} from "../../../api/types/support-ticket/supportTicket";
import { API_URL } from "../../../constants";

export default function searchSupportTickets(
  payload: ISearchSupportTickets
): Promise<supportTicketPayload[]> {
  return new Promise((resolve, reject) => {
    Axios.post<supportTicketsGet | ApiError>(
      `${API_URL}support/search/`,
      payload
    )
      .then(handleSupportTicketsGet)
      .then(resolve)
      .catch(reject);
  });
}
