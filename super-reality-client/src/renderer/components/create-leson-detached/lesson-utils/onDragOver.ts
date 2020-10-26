import reduxAction from "../../../redux/reduxAction";
import store from "../../../redux/stores/renderer";

export default function onDragOver(
  event: React.DragEvent<HTMLDivElement>,
  uniqueid: string
): void {
  event.preventDefault();
  reduxAction(store.dispatch, {
    type: "CREATE_LESSON_V2_DRAGOVER",
    arg: uniqueid,
  });
}
