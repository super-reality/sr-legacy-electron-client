import Axios from "axios";
import handleStepUpdate from "../../../api/handleStepUpdate";
import { ApiError } from "../../../api/types";
import { IStep } from "../../../api/types/step/step";
import StepUpdate from "../../../api/types/step/update";
import { API_URL } from "../../../constants";
import store from "../../../redux/stores/renderer";

export default function updateStep(data: Partial<IStep>, id: string) {
  const updated = store.getState().createLessonV2.treeSteps[id];
  const newData = {
    items: updated.items,
    ...data,
    Step_id: id,
  };

  Axios.put<StepUpdate | ApiError>(`${API_URL}Step`, newData)
    .then(handleStepUpdate)
    .catch(console.error);
}
