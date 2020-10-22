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
import ipcSend from "../../../../utils/ipcSend";
import reduxAction from "../../../redux/reduxAction";

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

  const itemWidth = 400;
  const itemHeight = 300;

  const updateCv = useCallback(() => {
    if (anchor) {
      ipcSend({
        method: "cv",
        arg: {
          ...anchor,
          cvMatchValue: 0,
          cvTemplates: anchor.templates,
          cvTo: "LESSON_CREATE",
        },
        to: "background",
      });
    }
  }, [anchor]);

  useEffect(() => {
    const interval = setInterval(updateCv, 1000);
    return () => clearInterval(interval);
  }, [updateCv]);

  const updatePos = useCallback(() => {
    const newPos = {
      x: anchor ? cvResult.x + (item?.relativePos.x || 0) : 0,
      y: anchor ? cvResult.y + (item?.relativePos.y || 0) : 0,
      width: anchor ? cvResult.width : itemWidth,
      height: anchor ? cvResult.height : itemHeight,
    };
    setPos(newPos);
  }, [anchor, cvResult, item]);

  useEffect(() => {
    if (!dragging.current) {
      updatePos();
    }
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
          dragging.current = true;
          const { target } = event;
          const x = parseFloat(target.style.left) + event.deltaRect.left;
          const y = parseFloat(target.style.top) + event.deltaRect.top;
          // fix for interact.js adding 4px to height/width on resize
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
            dragging.current = true;
            startPos.x += event.dx;
            startPos.y += event.dy;
            dragContainer.current.style.left = `${startPos.x}px`;
            dragContainer.current.style.top = `${startPos.y}px`;
          }
        })
        .on("resizeend", (event) => {
          dragging.current = false;
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
        })
        .on("dragend", () => {
          dragging.current = false;
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
        <FindBox ref={dragContainer} pos={pos} type="target" />
      )}
      {item && item.type == "image" && (
        <ImageBox ref={dragContainer} pos={pos} image={item.url} />
      )}
    </>
  );
}
