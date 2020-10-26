import Axios from "axios";
import handleStepGet from "../../../api/handleStepGet";
import { ApiError } from "../../../api/types";
import { StepGet } from "../../../api/types/step/get";
import { IStep } from "../../../api/types/step/step";
import { API_URL } from "../../../constants";

export default function getStep(id: string): Promise<IStep> {
  return new Promise((resolve, reject) => {
    Axios.get<StepGet | ApiError>(`${API_URL}step/${id}`)
      .then(handleStepGet)
      .then(resolve)
      .catch(reject);
  });
}
