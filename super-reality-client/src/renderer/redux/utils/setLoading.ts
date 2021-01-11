import store from "../stores/renderer";
import reduxAction from "../reduxAction";

export default function setLoading(arg: boolean) {
  reduxAction(store.dispatch, { type: "SET_LOADING_STATE", arg });
}
