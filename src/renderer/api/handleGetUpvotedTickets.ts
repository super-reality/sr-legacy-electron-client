import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import { IGetUpvotedTickets } from "./types/support-ticket/supportTicket";

/* eslint-disable camelcase */
export default function handleGetUpvotedTickets(
  res: AxiosResponse<IGetUpvotedTickets | ApiError>
): Promise<IGetUpvotedTickets> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<IGetUpvotedTickets>(res)
      .then((d) => resolve(d))
      .catch(reject);
  });
}
