import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import {
  supportTicketPayload,
  supportTicketsGet,
} from "./types/support-ticket/supportTicket";

/* eslint-disable camelcase */
export default function handleTicketsGet(
  res: AxiosResponse<supportTicketsGet | ApiError>
): Promise<supportTicketPayload[]> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<supportTicketsGet>(res)
      .then((d) => resolve(d.ticket))
      .catch(reject);
  });
}
