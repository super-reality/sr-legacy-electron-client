import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import {
  supportTicketPayload,
  supportTicketPayloadGet,
} from "./types/support-ticket/supportTicket";

/* eslint-disable camelcase */
export default function handleChapterGet(
  res: AxiosResponse<supportTicketPayloadGet | ApiError>
): Promise<supportTicketPayload> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<supportTicketPayloadGet>(res)
      .then((d) => resolve(d.ticket))
      .catch(reject);
  });
}
