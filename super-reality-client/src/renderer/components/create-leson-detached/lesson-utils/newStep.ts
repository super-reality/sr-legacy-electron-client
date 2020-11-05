import Axios from "axios";
import handleStepCreate from "../../../api/handleStepCreate";
import { ApiError } from "../../../api/types";
import { IStep } from "../../../api/types/step/step";
import StepCreate from "../../../api/types/step/create";
import { API_URL } from "../../../constants";
import reduxAction from "../../../redux/reduxAction";
import store from "../../../redux/stores/renderer";
import updateChapter from "./updateChapter";

export default function newStep(
  step: Partial<IStep> & { name: string },
  chapter?: string
): Promise<void | IStep> {
  const payload = {
    ...step,
  };
  return Axios.post<StepCreate | ApiError>(`${API_URL}step/create`, payload)
    .then(handleStepCreate)
    .then((data) => {
      reduxAction(store.dispatch, {
        type: "CREATE_LESSON_V2_SETSTEP",
        arg: { step: data, chapter },
      });
      if (chapter) {
        updateChapter({}, chapter);
      }
      return data;
    })
    .catch(console.error);
}
