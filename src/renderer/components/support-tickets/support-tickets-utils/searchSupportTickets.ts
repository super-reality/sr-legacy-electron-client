import Axios from "axios";
import handleSupportTicketsSearch from "../../../api/handleSupportTicketsSearch";
import { ApiError } from "../../../api/types";
import {
  ISearchSupportTickets,
  supportTicketsSearch,
  supportTicketPayload,
} from "../../../api/types/support-ticket/supportTicket";
import { API_URL } from "../../../constants";

export default function searchSupportTickets(
  payload: ISearchSupportTickets
): Promise<supportTicketPayload[]> {
  return new Promise((resolve, reject) => {
    Axios.post<supportTicketsSearch | ApiError>(
      `${API_URL}support/search/`,
      payload
    )
      .then(handleSupportTicketsSearch)
      .then(resolve)
      .catch(reject);
  });
}
