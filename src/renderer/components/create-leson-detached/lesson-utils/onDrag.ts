import reduxAction from "../../../redux/reduxAction";
import { TreeTypes } from "../../../redux/slices/createLessonSliceV2";
import store from "../../../redux/stores/renderer";

export default function onDrag(
  event: React.DragEvent<HTMLDivElement>,
  type: TreeTypes,
  id: string,
  parentId: string
): void {
  event.preventDefault();
  if (store.getState().createLessonV2.dragType == "none") {
    reduxAction(store.dispatch, {
      type: "CREATE_LESSON_V2_DRAG",
      arg: { type, id, parentId },
    });
  }
}
