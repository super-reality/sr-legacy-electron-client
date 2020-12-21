import updateItem from "./updateItem";
import store from "../../../redux/stores/renderer";
import { Rectangle } from "../../../../types/utils";
import reduxAction from "../../../redux/reduxAction";

export default function editStepItemsRelativePosition(
  stepId: string,
  prevPos: Rectangle,
  newPos: Rectangle
): void {
  const diffX = newPos.x - prevPos.x;
  const diffY = newPos.y - prevPos.y;

  const { treeSteps, treeItems } = store.getState().createLessonV2;
  const step = treeSteps[stepId];
  if (step) {
    step.items.forEach((itemId) => {
      const item = treeItems[itemId._id];
      if (item && item.anchor) {
        const relativePos = {
          ...item.relativePos,
          x: item.relativePos.x + diffX,
          y: item.relativePos.y + diffY,
        };
        // WARNING
        // doing this on a full chapter needs to account for possible duplicate items.
        // if you apply this to the same item twice it will shift the item position twice.
        updateItem({ relativePos }, item._id);
        reduxAction(store.dispatch, {
          type: "CREATE_LESSON_V2_SETITEM",
          arg: { item: { ...item, relativePos } },
        });
      }
    });
  }
}
