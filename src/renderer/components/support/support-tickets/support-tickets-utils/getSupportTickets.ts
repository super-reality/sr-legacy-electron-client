import Axios from "axios";
import handleSupportTicketsGet from "../../../../api/handleSupportTicketsGet";
import { ApiError } from "../../../../api/types";
import {
  supportTicketsGet,
  supportTicketPayload,
} from "../../../../api/types/support-ticket/supportTicket";
import { API_URL } from "../../../../constants";

export default function getCategories(
  page?: number
): Promise<supportTicketPayload[]> {
  return new Promise((resolve, reject) => {
    Axios.get<supportTicketsGet | ApiError>(`${API_URL}support`, {
      params: { page: page ?? 1 },
    })
      .then(handleSupportTicketsGet)
      .then(resolve)
      .catch(reject);
  });
}
