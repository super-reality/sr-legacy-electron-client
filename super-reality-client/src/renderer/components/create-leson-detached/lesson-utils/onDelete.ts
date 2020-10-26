import reduxAction from "../../../redux/reduxAction";
import { TreeTypes } from "../../../redux/slices/createLessonSliceV2";
import store from "../../../redux/stores/renderer";
import updateChapter from "./updateChapter";
import updateLesson from "./updateLesson";
import updateStep from "./updateStep";

export default function onDelete(
  type: TreeTypes,
  id: string,
  parentId: string
) {
  reduxAction(store.dispatch, {
    type: "CREATE_LESSON_V2_DELETE",
    arg: { type, id, parentId },
  });

  if (type == "chapter") updateLesson({}, parentId);
  if (type == "step") updateChapter({}, parentId);
  if (type == "item") updateStep({}, parentId);
}
