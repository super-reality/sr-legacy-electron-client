import React, { useEffect, useMemo, useRef } from "react";
import { useMeasure } from "react-use";
import interact from "interactjs";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../redux/stores/renderer";
import "./index.scss";
import reduxAction from "../../../redux/reduxAction";
import updateItem from "../lesson-utils/updateItem";
import FindBox from "../../lesson-player/find-box";
import ImageBox from "../../lesson-player/image.box";
import { cursorChecker } from "../../../constants";

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

  useEffect(() => {
    if (dragContainer.current && item) {
      let startX = item.relativePos.horizontal;
      let startY = item.relativePos.vertical;
      const startW = item.relativePos.width;
      const startH = item.relativePos.height;
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
            startX = (startX || 0) + (100 / (width - startW)) * event.dx;
            startY = (startY || 0) + (100 / (height - startH)) * event.dy;
            startX = Math.min(Math.max(startX, 0), 100);
            startY = Math.min(Math.max(startY, 0), 100);
            dragContainer.current.style.left = `calc((100% - ${startW}px) / 100 * ${startX})`;
            dragContainer.current.style.top = `calc((100% - ${startH}px) / 100 * ${startY})`;

            if (horPor.current) {
              horPor.current.style.display = "block";
              horPor.current.style.top = `calc((100% - ${startH}px) / 100 * ${startY} + ${
                startH / 2
              }px)`;
            }
            if (vertPos.current) {
              vertPos.current.style.display = "block";
              vertPos.current.style.left = `calc((100% - ${startW}px) / 100 * ${startX} + ${
                startW / 2
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

  let subType = "";
  if (item && item.type == "focus_highlight") {
    if (item.focus == "Area highlight") subType = "target";
    if (item.focus == "Mouse Point") subType = "mouse";
    if (item.focus == "Rectangle") subType = "rectangle";
  }

  const pos = useMemo(() => {
    return {
      x: 0,
      y: 0,
      width: item?.relativePos.width || 100,
      height: item?.relativePos.height || 100,
    };
  }, [item]);

  const style = useMemo(() => {
    return {
      left: `calc((100% - ${item?.relativePos.width}px) / 100 * ${
        item?.relativePos.horizontal || 0
      })`,
      top: `calc((100% - ${item?.relativePos.height}px) / 100 * ${
        item?.relativePos.vertical || 0
      })`,
    };
  }, [item]);

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
      {item && drawItemAbsolute && item.type == "focus_highlight" && (
        <FindBox
          ref={dragContainer}
          pos={pos}
          style={style}
          type="Area highlight"
        />
      )}
      {item && drawItemAbsolute && item.type == "image" && (
        <ImageBox
          ref={dragContainer}
          pos={pos}
          style={style}
          image={item.url}
        />
      )}
    </div>
  );
}
