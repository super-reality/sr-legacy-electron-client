import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import CollectionCreate from "./types/collection/create";
import apiErrorHandler from "./apiErrorHandler";
import reduxAction from "../redux/reduxAction";
import store from "../redux/stores/renderer";

export default function handleCollectionCreate(
  res: AxiosResponse<CollectionCreate | ApiError>
) {
  return new Promise((resolve, reject) => {
    apiErrorHandler<CollectionCreate>(res)
      .then((d) => {
        reduxAction(store.dispatch, {
          type: "CREATE_COLLECTION_RESET",
          arg: null,
        });
        resolve(d.data);
      })
      .catch(reject);
  });
}
