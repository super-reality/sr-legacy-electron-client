import store from "../redux/stores/renderer";
import reduxAction from "../redux/reduxAction";

export default function handleAuthError(response: any) {
  console.error(response);
  reduxAction(store.dispatch, { type: "AUTH_FAILED", arg: null });
}
