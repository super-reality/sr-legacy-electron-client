import interact from "interactjs";
import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../redux/stores/renderer";
import FindBox from "../find-box";
import {
  cursorChecker,
  restrictMinSize,
  voidFunction,
} from "../../../constants";
import reduxAction from "../../../redux/reduxAction";

export default function AnchorCrop() {
  const dispatch = useDispatch();
  const { currentAnchor, treeAnchors, cropRecordingPos } = useSelector(
    (state: AppState) => state.createLessonV2
  );
  const { cvResult } = useSelector((state: AppState) => state.render);
  const dragContainer = useRef<HTMLDivElement>(null);

  const setPos = useCallback(
    (pos) => {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: {
          cropRecordingPos: pos,
        },
      });
    },
    [dispatch]
  );

  useEffect(() => {
    if (dragContainer.current) {
      const startPos = { ...cropRecordingPos };
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
          const edge = 4;
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
          if (dragContainer.current) {
            startPos.x =
              event.rect.left -
              (dragContainer.current.parentElement?.offsetLeft || 0);
            startPos.y =
              event.rect.top -
              (dragContainer.current.parentElement?.offsetTop || 0);
            dragContainer.current.style.left = `${startPos.x}px`;
            dragContainer.current.style.top = `${startPos.y}px`;
          }
        })
        .on("resizestart", (event) => {
          if (dragContainer.current) {
            startPos.x =
              event.rect.left -
              (dragContainer.current.parentElement?.offsetLeft || 0);
            startPos.y =
              event.rect.top -
              (dragContainer.current.parentElement?.offsetTop || 0);
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
        .on("resizeend", (event) => {
          if (dragContainer.current && dragContainer.current.parentElement) {
            startPos.x =
              event.rect.left -
              (dragContainer.current.parentElement?.offsetLeft || 0);
            startPos.y =
              event.rect.top -
              (dragContainer.current.parentElement?.offsetTop || 0);
            startPos.width += 6;
            startPos.height += 6;
            dragContainer.current.style.left = `${startPos.x}px`;
            dragContainer.current.style.top = `${startPos.y}px`;
          }
          setPos(startPos);
        })
        .on("dragend", () => {
          setPos(startPos);
        });

      return (): void => {
        if (dragContainer.current) interact(dragContainer.current).unset();
      };
    }
    return voidFunction;
  }, [dispatch, cvResult, cropRecordingPos]);

  return (
    <>
      <FindBox ref={dragContainer} type="anchor" pos={cropRecordingPos} />
    </>
  );
}
