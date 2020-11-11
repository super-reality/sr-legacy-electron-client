import interact from "interactjs";
import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../redux/stores/renderer";
import FindBox from "../find-box";
import {
  cursorChecker,
  restrictMinSize,
  restrictSnapRound,
  voidFunction,
} from "../../../constants";
import reduxAction from "../../../redux/reduxAction";

export default function AnchorCrop() {
  const dispatch = useDispatch();
  const { cropRecordingPos, videoScale } = useSelector(
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
          modifiers: [restrictSnapRound, restrictMinSize],
          inertia: true,
        } as any)
        .on("resizemove", (event) => {
          const { target } = event;
          const x = parseFloat(target.style.left) + event.deltaRect.left;
          const y = parseFloat(target.style.top) + event.deltaRect.top;
          startPos.width = event.rect.width - 4 / videoScale;
          startPos.height = event.rect.height - 4 / videoScale;
          target.style.width = `${startPos.width}px`;
          target.style.height = `${startPos.height}px`;
          target.style.left = `${x}px`;
          target.style.top = `${y}px`;
        })
        .draggable({
          cursorChecker,
          modifiers: [
            restrictSnapRound,
            interact.modifiers.restrict({
              restriction: "parent",
            }),
          ],
        })
        .on("dragstart", (event) => {
          if (dragContainer.current) {
            startPos.x = dragContainer.current.offsetLeft || 0 + 3;
            startPos.y = dragContainer.current.offsetTop || 0 + 3;
            dragContainer.current.style.left = `${startPos.x}px`;
            dragContainer.current.style.top = `${startPos.y}px`;
            dragContainer.current.style.width = `${startPos.width}px`;
            dragContainer.current.style.height = `${startPos.height}px`;
          }
        })
        .on("resizestart", (event) => {
          const { target } = event;
          if (dragContainer.current) {
            startPos.x = target.offsetLeft || 0 + 3;
            startPos.y = target.offsetTop || 0 + 3;
            startPos.width = event.rect.width - 6;
            startPos.height = event.rect.height - 6;
            target.style.left = `${startPos.x}px`;
            target.style.top = `${startPos.y}px`;
            target.style.width = `${startPos.width}px`;
            target.style.height = `${startPos.height}px`;
          }
        })
        .on("dragmove", (event) => {
          if (dragContainer.current) {
            startPos.x += event.dx / videoScale;
            startPos.y += event.dy / videoScale;
            dragContainer.current.style.left = `${startPos.x}px`;
            dragContainer.current.style.top = `${startPos.y}px`;
          }
        })
        .on("resizeend", (event) => {
          if (dragContainer.current && dragContainer.current.parentElement) {
            startPos.x = dragContainer.current.offsetLeft;
            startPos.y = dragContainer.current.offsetTop;
            dragContainer.current.style.left = `${Math.round(startPos.x)}px`;
            dragContainer.current.style.top = `${Math.round(startPos.y)}px`;
          }
          startPos.width /= videoScale;
          startPos.height /= videoScale;
          setPos(startPos);
        })
        .on("dragend", () => {
          startPos.x += 3;
          startPos.y += 3;
          setPos(startPos);
        });

      return (): void => {
        if (dragContainer.current) interact(dragContainer.current).unset();
      };
    }
    return voidFunction;
  }, [dispatch, cvResult, cropRecordingPos, videoScale]);

  return (
    <>
      <FindBox ref={dragContainer} type="anchor" pos={cropRecordingPos} />
    </>
  );
}
