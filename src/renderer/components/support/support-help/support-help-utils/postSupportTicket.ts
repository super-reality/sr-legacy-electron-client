import Axios from "axios";
import handleSupportTicketPost from "../../../../api/handleSupportTicketPost";
import { ApiError } from "../../../../api/types";
import {
  supportTicketPayloadGet,
  supportTicketPayload,
} from "../../../../api/types/support-ticket/supportTicket";
import { API_URL } from "../../../../constants";

export default function getSkills(payload: supportTicketPayload): any {
  return new Promise((resolve, reject) => {
    Axios.post<supportTicketPayloadGet | ApiError>(
      `${API_URL}support/create`,
      payload
    )
      .then(handleSupportTicketPost)
      .then(resolve)
      .catch(reject);
  });
}
