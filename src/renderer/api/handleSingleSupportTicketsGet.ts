import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import {
  singleSupportTicketsPayload,
  singleSupportTicketsGet,
} from "./types/support-ticket/supportTicket";

export default function handleTicketsGet(
  res: AxiosResponse<singleSupportTicketsGet | ApiError>
): Promise<singleSupportTicketsPayload> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<singleSupportTicketsGet>(res)
      .then((d) => resolve(d.ticket))
      .catch(reject);
  });
}
