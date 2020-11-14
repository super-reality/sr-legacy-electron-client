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
  restrictSnapRound,
  voidFunction,
} from "../../../constants";
import reduxAction from "../../../redux/reduxAction";
import updateItem from "../../create-leson-detached/lesson-utils/updateItem";
import { IAbsolutePos } from "../../../api/types/item/item";
import FXBox from "../fx-box/fx-box";
import DialogBox from "../dialog-box";

interface ItemPreviewProps {
  itemId: string;
  stepId: string;
  onSucess?: () => void;
}

export default function ItemPreview(props: ItemPreviewProps) {
  const { itemId, stepId } = props;
  const { onSucess } = props;
  const dispatch = useDispatch();
  const { treeItems, treeSteps, treeAnchors, videoScale } = useSelector(
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

  const item = useMemo(() => (itemId ? treeItems[itemId] : undefined), [
    itemId,
    treeItems,
  ]);

  const step = useMemo(() => (stepId ? treeSteps[stepId] : undefined), [
    stepId,
    treeSteps,
  ]);

  // Get step's anchor or just the one in use
  const anchor = useMemo(() => {
    const anchorId = step?.anchor;
    return anchorId ? treeAnchors[anchorId] : undefined;
  }, [step, treeAnchors]);

  const updatePos = useCallback(() => {
    const newPos = {
      x:
        step?.anchor && item?.anchor
          ? cvResult.x + (item?.relativePos.x || 0)
          : 0,
      y:
        step?.anchor && item?.anchor
          ? cvResult.y + (item?.relativePos.y || 0)
          : 0,
      width: item?.relativePos.width || 400,
      height: item?.relativePos.height || 300,
    };
    setPos(newPos);

    const newStyle =
      step?.anchor && item?.anchor
        ? {}
        : {
            left: `calc((100% - ${item?.relativePos.width}px) / 100 * ${
              item?.relativePos.horizontal || 0
            })`,
            top: `calc((100% - ${item?.relativePos.height}px) / 100 * ${
              item?.relativePos.vertical || 0
            })`,
          };
    setStyle(newStyle);
  }, [cvResult, step, item]);

  useEffect(() => {
    updatePos();
  }, [cvResult, updatePos]);

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
    if (dragContainer.current && item && step) {
      const startPos = { ...pos };
      const scale = !onSucess ? videoScale : 1;
      let ratioForEffect = null;
      if (item.type == "fx") {
        ratioForEffect = interact.modifiers.aspectRatio({
          // make sure the width is always equal to the height
          ratio: 1,
          // also restrict the size by nesting another modifier
          modifiers: [interact.modifiers.restrictSize({ max: "parent" })],
        });
      }
      interact(dragContainer.current)
        .resizable({
          edges: { left: true, right: true, bottom: true, top: true },
          modifiers: [restrictSnapRound, restrictMinSize, ratioForEffect],
          inertia: false,
        } as any)
        .draggable({
          cursorChecker,
          modifiers: [
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
          if (step.anchor && item?.anchor) {
            startPos.x -= cvResult.x - 3;
            startPos.y -= cvResult.y - 3;
          } else if (div && div.parentElement) {
            if (!onSucess) {
              // startPos.width /= scale;
              // startPos.height /= scale;
            }
            startPos.horizontal =
              (100 / (div.parentElement.offsetWidth - startPos.width)) *
              startPos.x;
            startPos.vertical =
              (100 / (div.parentElement.offsetHeight - startPos.height)) *
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
        })
        .on("dragend", () => {
          const div = dragContainer.current;
          if (step.anchor && item?.anchor) {
            startPos.x -= cvResult.x - 3;
            startPos.y -= cvResult.y - 3;
          } else if (div && div.parentElement) {
            startPos.horizontal =
              (100 / (div.parentElement.offsetWidth - startPos.width)) *
              startPos.x;
            startPos.vertical =
              (100 / (div.parentElement.offsetHeight - startPos.height)) *
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
  }, [dispatch, cvResult, pos, step, item, videoScale]);

  const onSucessCallback = useCallback(
    (trigger: number | null) => {
      if (item && onSucess && trigger == item.trigger) {
        onSucess();
      }
    },
    [item]
  );

  return (
    <>
      {step?.anchor && item?.anchor && anchor && cvResult && (
        <FindBox clickThrough={!!onSucess} type="anchor" pos={cvResult} />
      )}
      {item && item.type == "focus_highlight" && (
        <FindBox
          ref={dragContainer}
          pos={pos}
          style={style}
          type={item.focus}
          callback={onSucessCallback}
        />
      )}
      {item && item.type == "image" && (
        <ImageBox
          ref={dragContainer}
          pos={pos}
          style={style}
          image={item.url}
          callback={onSucessCallback}
        />
      )}
      {item && item.type == "dialog" && (
        <DialogBox
          ref={dragContainer}
          pos={pos}
          style={style}
          text={item.text}
          callback={onSucessCallback}
        />
      )}
      {item && item.type == "fx" && (
        <FXBox
          ref={dragContainer}
          pos={pos}
          style={style}
          effect={item.effect}
          callback={onSucessCallback}
        />
      )}
    </>
  );
}
