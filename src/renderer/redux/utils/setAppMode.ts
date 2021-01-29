import store from "../stores/renderer";
import reduxAction from "../reduxAction";
import { UI_MODES } from "../slices/renderSlice";

export default function setAppMode(arg: UI_MODES): void {
  reduxAction(store.dispatch, { type: "SET_APP_MODE", arg });
}
