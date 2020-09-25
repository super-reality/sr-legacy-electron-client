import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import reduxAction from "../redux/reduxAction";
import store from "../redux/stores/renderer";
import CollectionCreate from "./types/collection/create";

export default function handleCollectionCreate(
  res: AxiosResponse<CollectionCreate | ApiError>
) {
  return new Promise((resolve, reject) => {
    if (res.status == 200) {
      if (res.data.err_code == 0) {
        reduxAction(store.dispatch, {
          type: "CREATE_COLLECTION_RESET",
          arg: null,
        });
        resolve();
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}
