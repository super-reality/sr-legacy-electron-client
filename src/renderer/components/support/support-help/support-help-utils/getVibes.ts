import Axios from "axios";
import handleSupportVibesGet from "../../../../api/handleSupportVibesGet";
import { ApiError } from "../../../../api/types";
import {
  IGetVibesObjectResult,
  IGetVibes,
} from "../../../../api/types/support-ticket/supportTicket";
import { API_URL } from "../../../../constants";

export default function getCategories(): Promise<IGetVibesObjectResult> {
  return new Promise((resolve, reject) => {
    Axios.get<IGetVibes | ApiError>(`${API_URL}vibe`)
      .then(handleSupportVibesGet)
      .then(resolve)
      .catch(reject);
  });
}
