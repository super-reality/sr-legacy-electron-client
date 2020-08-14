import store from "../redux/stores/renderer";
import reduxAction from "../redux/reduxAction";

export default function handleAuthLogin(response: any) {
  console.log(response);
  // Force login, we dont know the response form yet
  reduxAction(store.dispatch, { type: "AUTH_SUCCESSFUL", arg: "" });
}
