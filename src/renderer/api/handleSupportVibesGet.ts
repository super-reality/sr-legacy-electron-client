import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import {
  IGetVibesObjectResult,
  IGetVibes,
} from "./types/support-ticket/supportTicket";

/* eslint-disable camelcase */
export default function handleSupportVibesGet(
  res: AxiosResponse<IGetVibes | ApiError>
): Promise<IGetVibesObjectResult> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<IGetVibes>(res)
      .then((d) => resolve(d.result))
      .catch(reject);
  });
}
