import Axios from "axios";
import handleStepCreate from "../../../api/handleStepCreate";
import { ApiError } from "../../../api/types";
import StepCreate from "../../../api/types/step/create";
import { API_URL } from "../../../constants";
import reduxAction from "../../../redux/reduxAction";
import store from "../../../redux/stores/renderer";
import updateChapter from "./updateChapter";

export default function newStep(name: string, chapter?: string): void {
  const payload = {
    name,
  };
  Axios.post<StepCreate | ApiError>(`${API_URL}step/create`, payload)
    .then(handleStepCreate)
    .then((data) => {
      reduxAction(store.dispatch, {
        type: "CREATE_LESSON_V2_SETSTEP",
        arg: { step: data, chapter },
      });
      if (chapter) {
        updateChapter({}, chapter);
      }
    })
    .catch(console.error);
}
