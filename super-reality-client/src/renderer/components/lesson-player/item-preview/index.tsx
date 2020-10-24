import interact from "interactjs";
import React, {
  CSSProperties,
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
import {
  cursorChecker,
  restrictMinSize,
  voidFunction,
} from "../../../constants";
import reduxAction from "../../../redux/reduxAction";
import updateItem from "../../create-leson-detached/lesson-utils/updateItem";
import { IAbsolutePos } from "../../../api/types/item/item";

export default function ItemPreview() {
  const dispatch = useDispatch();
  const { currentAnchor, currentItem, treeItems, treeAnchors } = useSelector(
    (state: AppState) => state.createLessonV2
  );
  const { cvResult } = useSelector((state: AppState) => state.render);
  const dragContainer = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<IAbsolutePos>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [style, setStyle] = useState<CSSProperties>({});

  const item = useMemo(
    () => (currentItem ? treeItems[currentItem] : undefined),
    [currentItem, treeItems]
  );

  // Get item's anchor or just the one in use
  const anchor = useMemo(() => {
    const anchorId = item?.anchor || currentAnchor;
    return anchorId ? treeAnchors[anchorId] : undefined;
  }, [item, currentAnchor, treeAnchors]);

  // If the item does not have an anchor it should draw in abolsute position
  const drawItemAbsolute = item?.anchor === null;

  const updatePos = useCallback(() => {
    const newPos = {
      x: anchor ? cvResult.x + (item?.relativePos.x || 0) : 0,
      y: anchor ? cvResult.y + (item?.relativePos.y || 0) : 0,
      width: item?.relativePos.width || 400,
      height: item?.relativePos.height || 300,
    };
    setPos(newPos);

    const newStyle = item?.anchor
      ? {}
      : {
          left: `calc((100% - ${
            item?.relativePos.width
          }px) / 100 * ${Math.round(item?.relativePos.horizontal || 0)})`,
          top: `calc((100% - ${
            item?.relativePos.height
          }px) / 100 * ${Math.round(item?.relativePos.vertical || 0)})`,
        };
    setStyle(newStyle);
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
          const edge = item.type == "focus_highlight" ? 4 : 0;
          startPos.width = event.rect.width - edge;
          startPos.height = event.rect.height - edge;
          target.style.width = `${event.rect.width - edge}px`;
          target.style.height = `${event.rect.height - edge}px`;
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
        .on("dragstart", (event) => {
          if (!item.anchor && dragContainer.current) {
            startPos.x = event.rect.left;
            startPos.y = event.rect.top;
            dragContainer.current.style.left = `${startPos.x}px`;
            dragContainer.current.style.top = `${startPos.y}px`;
          }
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
          if (item.anchor) {
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
          if (item.anchor) {
            startPos.x -= cvResult.x;
            startPos.y -= cvResult.y;
          } else if (
            dragContainer.current &&
            dragContainer.current.parentElement
          ) {
            startPos.horizontal =
              (100 /
                (dragContainer.current.parentElement.offsetWidth -
                  startPos.width)) *
              startPos.x;
            startPos.vertical =
              (100 /
                (dragContainer.current.parentElement.offsetHeight -
                  startPos.height)) *
              startPos.y;
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
    return voidFunction;
  }, [dispatch, cvResult, pos, item]);

  return (
    <>
      {item?.anchor && anchor && cvResult && (
        <FindBox type="anchor" pos={cvResult} />
      )}
      {item && item.type == "focus_highlight" && (
        <FindBox
          ref={dragContainer}
          pos={pos}
          style={style}
          type={item.focus}
        />
      )}
      {item && item.type == "image" && (
        <ImageBox
          ref={dragContainer}
          pos={pos}
          style={style}
          image={item.url}
        />
      )}
    </>
  );
}
