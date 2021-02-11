import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import {
  supportTicketPayload,
  supportTicketsSearch,
} from "./types/support-ticket/supportTicket";

/* eslint-disable camelcase */
export default function handleTicketsGet(
  res: AxiosResponse<supportTicketsSearch | ApiError>
): Promise<supportTicketPayload[]> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<supportTicketsSearch>(res)
      .then((d) => resolve(d.tickets))
      .catch(reject);
  });
}
