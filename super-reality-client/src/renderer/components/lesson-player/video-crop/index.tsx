import interact from "interactjs";
import React, { CSSProperties, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../redux/stores/renderer";
import {
  cursorChecker,
  restrictMinSize,
  restrictSnapRound,
  voidFunction,
} from "../../../constants";
import reduxAction from "../../../redux/reduxAction";
import { IAbsolutePos } from "../../../items/item";
import VideoCropBox from "../../../items/boxes/video-crop-box";

export default function VideoCrop() {
  const dispatch = useDispatch();
  const { previewEditArea, videoScale } = useSelector(
    (state: AppState) => state.createLessonV2
  );
  const { cvResult } = useSelector((state: AppState) => state.render);
  const dragContainer = useRef<HTMLDivElement>(null);
  const shadeContainer = useRef<HTMLDivElement>(null);

  const setPos = useCallback(
    (pos) => {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: {
          previewEditArea: pos,
        },
      });
    },
    [dispatch]
  );

  function updateDiv(startPos: IAbsolutePos) {
    const div = dragContainer.current;

    const x = Math.round(startPos.x);
    const y = Math.round(startPos.y);
    const width = Math.round(startPos.width);
    const height = Math.round(startPos.height);

    if (div) {
      div.style.left = `${x}px`;
      div.style.top = `${y}px`;
      div.style.width = `${width}px`;
      div.style.height = `${height}px`;
    }
    /*
    const shade = shadeContainer.current;
    if (shade) {
      shade.style.webkitMask = `url('data:image/svg+xml;utf8,
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${} ${}" preserveAspectRatio="none">
        <polygon points="${x},${y} ${x},${y + height} ${x + width},${
        y + height
      } ${x + width},${y}" fill="black"/>
      </svg>') 0/100% 100%,linear-gradient(#fff,#fff)`;
    }
    */
  }

  useEffect(() => {
    if (dragContainer.current) {
      const startPos = { ...previewEditArea };
      const scale = videoScale;
      let resizeMargin = 16;
      if (startPos.width < 56 || startPos.height < 56) resizeMargin = 6;
      interact(dragContainer.current)
        .resizable({
          edges: { left: true, right: true, bottom: true, top: true },
          modifiers: [restrictSnapRound, restrictMinSize],
          margin: resizeMargin,
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
          if (div && div.parentElement) {
            startPos.x =
              (event.rect.left - div.parentElement.getBoundingClientRect().x) /
              scale;
            startPos.y =
              (event.rect.top - div.parentElement.getBoundingClientRect().y) /
              scale;
            startPos.width = (event.rect.width - 3) / scale;
            startPos.height = (event.rect.height - 3) / scale;
            updateDiv(startPos);
          }
        })
        .on("dragstart", () => {
          const div = dragContainer.current;
          if (div) {
            startPos.x = div.offsetLeft || 0;
            startPos.y = div.offsetTop || 0;
            updateDiv(startPos);
          }
        })
        .on("dragmove", (event) => {
          startPos.x += event.dx / scale;
          startPos.y += event.dy / scale;
          updateDiv(startPos);
        })
        .on("resizeend", () => {
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
  }, [dispatch, cvResult, previewEditArea, videoScale]);

  const baseShadeStyle: CSSProperties = {
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    position: "absolute",
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
    WebkitMaskComposite: "destination-out",
  };

  return (
    <>
      <div ref={shadeContainer} style={{ ...baseShadeStyle }} />
      <VideoCropBox ref={dragContainer} pos={previewEditArea} />
    </>
  );
}
