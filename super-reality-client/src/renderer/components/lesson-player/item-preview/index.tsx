import interact from "interactjs";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../redux/stores/renderer";
import FindBox from "../find-box";
import ImageBox from "../image.box";
import { cursorChecker, restrictMinSize } from "../../../constants";
import reduxAction from "../../../redux/reduxAction";
import updateItem from "../../create-leson-detached/lesson-utils/updateItem";

export default function ItemPreview() {
  const dispatch = useDispatch();
  const { currentAnchor, currentItem, treeItems, treeAnchors } = useSelector(
    (state: AppState) => state.createLessonV2
  );
  const { cvResult } = useSelector((state: AppState) => state.render);
  const dragContainer = useRef<HTMLDivElement>(null);
  const dragging = useRef<boolean>(false);
  const [pos, setPos] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const item = useMemo(
    () => (currentItem ? treeItems[currentItem] : undefined),
    [currentItem, treeItems]
  );

  // Get item's anchor or just the one in use
  const anchorId = item?.anchor || currentAnchor;
  const anchor = anchorId ? treeAnchors[anchorId] : undefined;

  // If the item does not have an anchor it should draw in abolsute position
  const drawItemAbsolute = item?.anchor === null;

  const updatePos = useCallback(() => {
    const newPos = {
      x: anchor ? cvResult.x + (item?.relativePos.x || 0) : 0,
      y: anchor ? cvResult.y + (item?.relativePos.y || 0) : 0,
      width: item?.relativePos.width || 100,
      height: item?.relativePos.height || 100,
    };
    setPos(newPos);
  }, [anchor, cvResult, item]);

  useEffect(() => {
    updatePos();
  }, [cvResult, updatePos]);

  useEffect(() => {
    if (dragContainer.current && item) {
      const startPos = { ...pos };
      interact(dragContainer.current)
        .resizable({
          edges: { left: true, right: true, bottom: true, top: true },
          modifiers: [restrictMinSize],
          inertia: true,
        } as any)
        .on("resizemove", (event) => {
          const { target } = event;
          const x = parseFloat(target.style.left) + event.deltaRect.left;
          const y = parseFloat(target.style.top) + event.deltaRect.top;
          // fix for interact.js adding 4px to height/width on resize
          startPos.width = event.rect.width - 4;
          startPos.height = event.rect.height - 4;
          target.style.width = `${event.rect.width - 4}px`;
          target.style.height = `${event.rect.height - 4}px`;
          target.style.left = `${x}px`;
          target.style.top = `${y}px`;
        })
        .draggable({
          cursorChecker,
          modifiers: [
            interact.modifiers.restrict({
              restriction: "parent",
            }),
          ],
        })
        .on("dragmove", (event) => {
          if (dragContainer.current) {
            startPos.x += event.dx;
            startPos.y += event.dy;
            dragContainer.current.style.left = `${startPos.x}px`;
            dragContainer.current.style.top = `${startPos.y}px`;
          }
        })
        .on("resizeend", () => {
          if (anchor) {
            startPos.x -= cvResult.x;
            startPos.y -= cvResult.y;
          }
          reduxAction(dispatch, {
            type: "CREATE_LESSON_V2_SETITEM",
            arg: {
              item: {
                ...item,
                relativePos: startPos,
              },
            },
          });
          updateItem({ ...item, relativePos: startPos }, item._id);
        })
        .on("dragend", () => {
          if (anchor) {
            startPos.x -= cvResult.x;
            startPos.y -= cvResult.y;
          }
          reduxAction(dispatch, {
            type: "CREATE_LESSON_V2_SETITEM",
            arg: {
              item: {
                ...item,
                relativePos: startPos,
              },
            },
          });
          updateItem({ ...item, relativePos: startPos }, item._id);
        });

      return (): void => {
        if (dragContainer.current) interact(dragContainer.current).unset();
      };
    }
    return () => {};
  }, [dispatch, cvResult, pos, item]);

  return (
    <>
      {anchor && cvResult && <FindBox type="anchor" pos={cvResult} />}
      {item && item.type == "focus_highlight" && (
        <FindBox ref={dragContainer} pos={pos} type={item.focus} />
      )}
      {item && item.type == "image" && (
        <ImageBox ref={dragContainer} pos={pos} image={item.url} />
      )}
    </>
  );
}