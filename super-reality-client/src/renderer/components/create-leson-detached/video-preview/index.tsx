import React, { useEffect, useMemo, useRef } from "react";
import { useMeasure } from "react-use";
import interact from "interactjs";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../redux/stores/renderer";
import "./index.scss";
import reduxAction from "../../../redux/reduxAction";
import updateItem from "../lesson-utils/updateItem";

const cursorChecker: any = (
  action: any,
  _interactable: any,
  _element: any,
  interacting: boolean
): string => {
  switch (action.axis) {
    case "x":
      return "ew-resize";
    case "y":
      return "ns-resize";
    default:
      return interacting ? "grabbing" : "grab";
  }
};

export default function VideoPreview(): JSX.Element {
  const {
    currentRecording,
    currentAnchor,
    currentItem,
    treeItems,
    treeAnchors,
  } = useSelector((state: AppState) => state.createLessonV2);
  const dispatcher = useDispatch();
  const dragContainer = useRef<HTMLDivElement>(null);
  const horPor = useRef<HTMLDivElement>(null);
  const vertPos = useRef<HTMLDivElement>(null);

  const [containerRef, { width, height }] = useMeasure<HTMLDivElement>();

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

  useEffect(() => {
    if (dragContainer.current && item) {
      let startX = item.relativePos.horizontal;
      let startY = item.relativePos.vertical;
      interact(dragContainer.current)
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
            startX = (startX || 0) + (100 / (width - itemWidth)) * event.dx;
            startY = (startY || 0) + (100 / (height - itemHeight)) * event.dy;
            startX = Math.min(Math.max(startX, 0), 100);
            startY = Math.min(Math.max(startY, 0), 100);
            dragContainer.current.style.left = `calc((100% - ${itemWidth}px) / 100 * ${startX})`;
            dragContainer.current.style.top = `calc((100% - ${itemHeight}px) / 100 * ${startY})`;

            if (horPor.current) {
              horPor.current.style.display = "block";
              horPor.current.style.top = `calc((100% - ${itemHeight}px) / 100 * ${startY} + ${
                itemHeight / 2
              }px)`;
            }
            if (vertPos.current) {
              vertPos.current.style.display = "block";
              vertPos.current.style.left = `calc((100% - ${itemWidth}px) / 100 * ${startX} + ${
                itemWidth / 2
              }px)`;
            }
          }
        })
        .on("dragend", () => {
          const newRelativePos = {
            ...item.relativePos,
            horizontal: startX,
            vertical: startY,
          };
          reduxAction(dispatcher, {
            type: "CREATE_LESSON_V2_SETITEM",
            arg: {
              item: {
                ...item,
                relativePos: newRelativePos,
              },
            },
          });
          updateItem({ relativePos: newRelativePos }, item._id);
        });

      return (): void => {
        if (dragContainer.current) interact(dragContainer.current).unset();
      };
    }
    return () => {};
  }, [item, width, height, dispatcher]);

  return (
    <div ref={containerRef} className="video-preview-container">
      {!currentRecording && (
        <div className="video-preview-no-video">
          Select a recording to preview
        </div>
      )}
      <div
        key={`hor-${item?._id}` || ""}
        ref={horPor}
        className="horizontal-pos"
      />
      <div
        key={`ver-${item?._id}` || ""}
        ref={vertPos}
        className="vertical-pos"
      />
      {item && drawItemAbsolute ? (
        <div
          ref={dragContainer}
          className={`item-${item.type}`}
          style={{
            left: `calc((100% - ${itemWidth}px) / 100 * ${item.relativePos.horizontal})`,
            top: `calc((100% - ${itemHeight}px) / 100 * ${item.relativePos.vertical})`,
            width: itemWidth,
            height: itemHeight,
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
