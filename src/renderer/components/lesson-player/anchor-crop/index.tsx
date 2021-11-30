import interact from "interactjs";
import { useCallback, useEffect, useRef } from "react";
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
import AnchorBox from "../../../items/boxes/anchor-box";

export default function VideoCrop() {
  const dispatch = useDispatch();
  const { previewEditArea, videoScale } = useSelector(
    (state: AppState) => state.createLessonV2
  );
  const { cvResult } = useSelector((state: AppState) => state.render);
  const dragContainer = useRef<HTMLDivElement>(null);

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
    if (div) {
      div.style.left = `${Math.round(startPos.x)}px`;
      div.style.top = `${Math.round(startPos.y)}px`;
      div.style.width = `${Math.round(startPos.width)}px`;
      div.style.height = `${Math.round(startPos.height)}px`;
    }
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

  return <AnchorBox ref={dragContainer} pos={previewEditArea} />;
}
