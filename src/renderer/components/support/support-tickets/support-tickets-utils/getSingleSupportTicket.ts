import Axios from "axios";
import handleSingleSupportTicketsGet from "../../../../api/handleSingleSupportTicketsGet";
import { ApiError } from "../../../../api/types";
import {
  singleSupportTicketsGet,
  singleSupportTicketsPayload,
} from "../../../../api/types/support-ticket/supportTicket";
import { API_URL } from "../../../../constants";

export default function getSingleSupportTicket(
  id: string
): Promise<singleSupportTicketsPayload> {
  return new Promise((resolve, reject) => {
    Axios.get<singleSupportTicketsGet | ApiError>(`${API_URL}support/${id}`)
      .then(handleSingleSupportTicketsGet)
      .then(resolve)
      .catch(reject);
  });
}
