import Axios from "axios";
import handleAnchorCreate from "../../../api/handleAnchorCreate";
import handleStepCreate from "../../../api/handleStepCreate";
import { ApiError } from "../../../api/types";
import { IAnchor } from "../../../api/types/anchor/anchor";
import AnchorCreate from "../../../api/types/anchor/create";
import { API_URL } from "../../../constants";
import reduxAction from "../../../redux/reduxAction";
import store from "../../../redux/stores/renderer";
import updateItem from "./updateItem";

export default function newAnchor(
  payload: Partial<IAnchor>,
  item?: string
): void {
  Axios.post<AnchorCreate | ApiError>(`${API_URL}anchor/create`, payload)
    .then(handleAnchorCreate)
    .then((data) => {
      reduxAction(store.dispatch, {
        type: "CREATE_LESSON_V2_SETANCHOR",
        arg: { anchor: data, item },
      });
      if (item) {
        updateItem({ anchor: data._id }, item);
      }
    })
    .catch(console.error);
}
