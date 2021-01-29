import reduxAction from "../../../redux/reduxAction";
import store from "../../../redux/stores/renderer";

export default function setStatus(status: string) {
  reduxAction(store.dispatch, {
    type: "CREATE_LESSON_V2_DATA",
    arg: { status },
  });
}
