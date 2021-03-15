import Axios from "axios";
import handleSupportSkillsGet from "../../../../api/handleSupportSkillsGet";
import { ApiError } from "../../../../api/types";
import {
  IDataGet,
  ISkillsGet,
} from "../../../../api/types/support-ticket/supportTicket";
import { API_URL } from "../../../../constants";

export default function getSkills(name: string): Promise<IDataGet[]> {
  return new Promise((resolve, reject) => {
    Axios.get<ISkillsGet | ApiError>(`${API_URL}skill/search/${name}`)
      .then(handleSupportSkillsGet)
      .then(resolve)
      .catch(reject);
  });
}
