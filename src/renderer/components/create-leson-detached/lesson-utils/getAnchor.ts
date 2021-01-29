import Axios from "axios";
import handleAnchorGet from "../../../api/handleAnchorGet";
import { ApiError } from "../../../api/types";
import { IAnchor } from "../../../api/types/anchor/anchor";
import { AnchorGet } from "../../../api/types/anchor/get";
import { API_URL } from "../../../constants";

export default function getAnchor(id: string): Promise<IAnchor> {
  return new Promise((resolve, reject) => {
    Axios.get<AnchorGet | ApiError>(`${API_URL}anchor/${id}`)
      .then(handleAnchorGet)
      .then(resolve)
      .catch(reject);
  });
}
