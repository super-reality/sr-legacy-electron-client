import store from "../redux/stores/renderer";
import reduxAction from "../redux/reduxAction";

export default function handleGenericError(response: any) {
  reduxAction(store.dispatch, { type: "SET_LOADING_STATE", arg: false });
  console.error(response);
}
