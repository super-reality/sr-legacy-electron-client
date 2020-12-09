import interact from "interactjs";
import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../redux/stores/renderer";
import {
  cursorChecker,
  restrictMinSize,
  restrictSnapRound,
  voidFunction,
} from "../../../constants";
import reduxAction from "../../../redux/reduxAction";
import { IAbsolutePos } from "../../../api/types/item/item";
import AnchorBox from "../anchor-box";

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

  function updateDiv(startPos: IAbsolutePos) {
    const div = dragContainer.current;
    if (div) {
      div.style.left = `${Math.round(startPos.x)}px`;
      div.style.top = `${Math.round(startPos.y)}px`;
      div.style.width = `${Math.round(startPos.width)}px`;
      div.style.height = `${Math.round(startPos.height)}px`;
    }
  }

  useEffect(() => {
    if (dragContainer.current) {
      const startPos = { ...cropRecordingPos };
      const scale = videoScale;
      interact(dragContainer.current)
        .resizable({
          edges: { left: true, right: true, bottom: true, top: true },
          modifiers: [restrictSnapRound, restrictMinSize],
          margin: 16,
          inertia: false,
        } as any)
        .draggable({
          cursorChecker,
          modifiers: [
            restrictSnapRound,
            interact.modifiers.restrict({
              restriction: "parent",
            }),
          ],
        })
        .on("resizemove", (event) => {
          const div = dragContainer.current;
          if (div) {
            const delta = event.deltaRect;
            startPos.x = div.offsetLeft + delta.left / scale;
            startPos.y = div.offsetTop + delta.top / scale;
            startPos.width = (event.rect.width - 6) / scale;
            startPos.height = (event.rect.height - 6) / scale;
            updateDiv(startPos);
          }
        })
        .on("dragstart", (event) => {
          const div = dragContainer.current;
          if (div) {
            startPos.x = div.offsetLeft || 0;
            startPos.y = div.offsetTop || 0;
            updateDiv(startPos);
          }
        })
        .on("resizestart", (event) => {
          const div = dragContainer.current;
          if (div) {
            startPos.x = div.offsetLeft || 0;
            startPos.y = div.offsetTop || 0;
            startPos.width = (event.rect.width - 6) / scale;
            startPos.height = (event.rect.height - 6) / scale;
            updateDiv(startPos);
          }
        })
        .on("dragmove", (event) => {
          startPos.x += event.dx / scale;
          startPos.y += event.dy / scale;
          updateDiv(startPos);
        })
        .on("resizeend", (event) => {
          const div = dragContainer.current;
          if (div && div.parentElement) {
            startPos.x = div.offsetLeft + 3;
            startPos.y = div.offsetTop + 3;
            setPos(startPos);
          }
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

  return <AnchorBox ref={dragContainer} pos={cropRecordingPos} />;
}
