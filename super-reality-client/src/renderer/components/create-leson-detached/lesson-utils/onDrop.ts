import reduxAction from "../../../redux/reduxAction";
import { TreeTypes } from "../../../redux/slices/createLessonSliceV2";
import store from "../../../redux/stores/renderer";
import updateChapter from "./updateChapter";
import updateLesson from "./updateLesson";
import updateStep from "./updateStep";

export default function onDrop(
  event: React.DragEvent<HTMLDivElement>,
  type: TreeTypes,
  id: string,
  parentId: string
): void {
  const sourceType = store.getState().createLessonV2.dragType;
  const sourceID = store.getState().createLessonV2.dragId;
  const sourceParentId = store.getState().createLessonV2.dragParent;
  if (type == sourceType && parentId == sourceParentId) {
    // Just reorder in same parent
    reduxAction(store.dispatch, {
      type: "CREATE_LESSON_V2_MOVE",
      arg: { type: type, idFrom: sourceID, idTo: id, parentId: parentId },
    });
  } else if (type == sourceType && parentId !== sourceParentId) {
    // Move to another parent and reorder
    reduxAction(store.dispatch, {
      type: "CREATE_LESSON_V2_CUT",
      arg: {
        type: sourceType,
        id: sourceID,
        sourceParent: sourceParentId,
        destParent: parentId,
      },
    });
    reduxAction(store.dispatch, {
      type: "CREATE_LESSON_V2_MOVE",
      arg: { type: type, idFrom: sourceID, idTo: id, parentId: parentId },
    });
  } else if (sourceParentId !== id) {
    // Mote to another parent, push
    let isCut = false;
    if (type == "lesson" && sourceType == "chapter") isCut = true;
    if (type == "chapter" && sourceType == "step") isCut = true;
    if (type == "step" && sourceType == "item") isCut = true;
    if (isCut) {
      reduxAction(store.dispatch, {
        type: "CREATE_LESSON_V2_CUT",
        arg: {
          type: sourceType,
          id: sourceID,
          sourceParent: sourceParentId,
          destParent: id,
        },
      });
    }
  }

  if (type == "chapter") updateLesson({}, parentId);
  if (type == "step") updateChapter({}, parentId);
  if (type == "item") updateStep({}, parentId);
  if (sourceParentId !== parentId) {
    if (type == "chapter") updateLesson({}, sourceParentId);
    if (type == "step") updateChapter({}, sourceParentId);
    if (type == "item") updateStep({}, sourceParentId);
  }

  reduxAction(store.dispatch, {
    type: "CREATE_LESSON_V2_DRAG",
    arg: { type: "none", id: "", parentId: "" },
  });
}
