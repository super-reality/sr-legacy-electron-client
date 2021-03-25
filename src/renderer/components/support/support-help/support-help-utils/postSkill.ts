import Axios from "axios";
import handleSkillPost from "../../../../api/handleSkillPost";
import { ApiError } from "../../../../api/types";
import {
  ISkill,
  ISkillGet,
} from "../../../../api/types/support-ticket/supportTicket";
import { API_URL } from "../../../../constants";

export default function getSkills(name: string): Promise<ISkill> {
  return new Promise((resolve, reject) => {
    Axios.post<ISkillGet | ApiError>(`${API_URL}skill/create`, { name: name })
      .then(handleSkillPost)
      .then(resolve)
      .catch(reject);
  });
}
