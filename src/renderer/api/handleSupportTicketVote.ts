import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import { singleSupportTicketsGet } from "./types/support-ticket/supportTicket";

export default function handleSupportTicketVote(
  res: AxiosResponse<singleSupportTicketsGet | ApiError>
): Promise<null> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<singleSupportTicketsGet>(res)
      .then((d) => {
        console.log(d);
        resolve(null);
      })
      .catch(reject);
  });
}
