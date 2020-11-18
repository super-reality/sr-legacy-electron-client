import Axios from "axios";
import _ from "lodash";
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
    step_id: id,
  };

  return Axios.put<StepUpdate | ApiError>(
    `${API_URL}step`,
    _.omit(newData, ["_id", "__v", "createdBy", "createdAt", "updatedAt"])
  )
    .then(handleStepUpdate)
    .catch((e) => {
      console.error(e);
      return undefined;
    });
}
