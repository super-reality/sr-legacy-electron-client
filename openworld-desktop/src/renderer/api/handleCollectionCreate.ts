import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import reduxAction from "../redux/reduxAction";
import store from "../redux/stores/renderer";
import CollectionCreate from "./types/collection/create";

export default function handleCollectionCreate(
  res: AxiosResponse<CollectionCreate | ApiError>
) {
  if (res.status === 200) {
    reduxAction(store.dispatch, { type: "CREATE_COLLECTION_RESET", arg: null });
  }
}
