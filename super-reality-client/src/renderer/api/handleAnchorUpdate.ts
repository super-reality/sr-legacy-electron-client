import { AxiosResponse } from "axios";
import reduxAction from "../redux/reduxAction";
import store from "../redux/stores/renderer";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import { IAnchor } from "./types/anchor/anchor";
import AnchorUpdate from "./types/anchor/update";

/* eslint-disable camelcase */
export default function handleAnchorUpdate(
  res: AxiosResponse<AnchorUpdate | ApiError>
): Promise<IAnchor> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<AnchorUpdate>(res)
      .then((d) => {
        reduxAction(store.dispatch, {
          type: "CREATE_LESSON_V2_SETANCHOR",
          arg: { anchor: d.anchor },
        });
        resolve(d.anchor);
      })
      .catch(reject);
  });
}
