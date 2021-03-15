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
import store, { AppState } from "../../../redux/stores/renderer";
import {
  cursorChecker,
  restrictMinSize,
  restrictSnapRound,
  restrictSnapGrid,
  voidFunction,
} from "../../../constants";
import reduxAction from "../../../redux/reduxAction";
import updateItem from "../../create-leson-detached/lesson-utils/updateItem";
import { IAbsolutePos } from "../../../items/item";
import updatePosMarker from "../../create-leson-detached/lesson-utils/updatePosMarker";
import hidePosMarker from "../../create-leson-detached/lesson-utils/hidePosMarker";
import getItemComponent from "../../../items/getItemComponent";
import pendingReduxAction from "../../../redux/utils/pendingReduxAction";
import useAnchor from "../../create-leson-detached/hooks/useAnchor";
import { TriggerTypes } from "../../../items/endStep";

interface ItemPreviewProps {
  itemId: string;
  stepId: string;
  onSucess?: () => void;
}

export default function ItemPreview(props: ItemPreviewProps) {
  const { itemId, stepId } = props;
  const { onSucess } = props;
  const dispatch = useDispatch();
  const { previewing, treeItems, treeSteps, videoScale } = useSelector(
    (state: AppState) => state.createLessonV2
  );
  const { cvResult } = useSelector((state: AppState) => state.render);

  const [show, setShow] = useState(false);

  useEffect(() => {
    // Let the anchors update before we show the item
    const delayedShow = () => setTimeout(() => setShow(true), 100);

    const prevCvResult = store.getState().render.cvResult;
    pendingReduxAction((state) => state.render.cvResult, prevCvResult, 2000)
      .then(delayedShow)
      .catch(delayedShow);
  }, []);

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

  const anchors =
    step?.startWhen.filter((tv) => tv.type == "Image Found") || [];

  const anchorId = (anchors[0]?.value as string) || null;

  const anchor = useAnchor(anchorId || undefined);

  const isOcr: boolean = useMemo(
    () =>
      step
        ? step.startWhen.filter((tv) => tv.type == "Text Found").length > 0
        : false,
    [step]
  );

  const updatePos = useCallback(() => {
    const newPos = {
      x:
        (anchorId && item?.anchor) || isOcr
          ? cvResult.x + (item?.relativePos.x || 0)
          : 0,
      y:
        (anchorId && item?.anchor) || isOcr
          ? cvResult.y + (item?.relativePos.y || 0)
          : 0,
      width: item?.relativePos.width || 400,
      height: item?.relativePos.height || 300,
    };
    setPos(newPos);

    const newStyle =
      (anchorId && item?.anchor) || isOcr
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
  }, [cvResult, step, isOcr, item]);

  useEffect(() => {
    updatePos();
  }, [cvResult, updatePos]);

  const updateDiv = useCallback(
    (startPos: IAbsolutePos) => {
      const div = dragContainer.current;
      if (div) {
        div.style.left = `${Math.round(startPos.x)}px`;
        div.style.top = `${Math.round(startPos.y)}px`;
        div.style.width = `${Math.round(startPos.width)}px`;
        div.style.height = `${Math.round(startPos.height)}px`;
      }
    },
    [dragContainer]
  );

  useEffect(() => {
    if (dragContainer.current && item && step) {
      const startPos = { ...pos };
      const scale = !onSucess ? videoScale : 1;

      const resizeMods: any[] = [restrictSnapRound, restrictMinSize];
      const dragMods: any[] = [
        interact.modifiers.restrict({
          restriction: "parent",
        }),
      ];

      if (item.type !== "focus_highlight" && item.type !== "fx") {
        resizeMods.push(restrictSnapGrid);
        dragMods.push(restrictSnapGrid);
      }

      let resizeMargin = 16;
      if (startPos.width < 56 || startPos.height < 56) resizeMargin = 6;

      interact(dragContainer.current)
        .resizable({
          edges: { left: true, right: true, bottom: true, top: true },
          modifiers: resizeMods,
          margin: resizeMargin,
          inertia: false,
        } as any)
        .draggable({
          cursorChecker,
          modifiers: dragMods,
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

            startPos.horizontal =
              (100 / (div.parentElement.offsetWidth - startPos.width)) *
              startPos.x;
            startPos.vertical =
              (100 / (div.parentElement.offsetHeight - startPos.height)) *
              startPos.y;
            updatePosMarker(startPos, item.anchor);
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
          const div = dragContainer.current;
          startPos.x += event.dx / scale;
          startPos.y += event.dy / scale;
          if (div && div.parentElement) {
            startPos.horizontal =
              (100 / (div.parentElement.offsetWidth - startPos.width)) *
              startPos.x;
            startPos.vertical =
              (100 / (div.parentElement.offsetHeight - startPos.height)) *
              startPos.y;
          }
          updatePosMarker(startPos, item.anchor);
          updateDiv(startPos);
        })
        .on("resizeend", () => {
          const div = dragContainer.current;
          if ((anchorId && item?.anchor) || isOcr) {
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
          hidePosMarker();
          reduxAction(dispatch, {
            type: "CREATE_LESSON_V2_SETITEM",
            arg: {
              item: {
                ...item,
                relativePos: startPos,
              },
            },
          });
          updateItem<typeof item>({ ...item, relativePos: startPos }, item._id);
        })
        .on("dragend", () => {
          const div = dragContainer.current;
          if ((anchorId && item?.anchor) || isOcr || isOcr) {
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
          hidePosMarker();
          reduxAction(dispatch, {
            type: "CREATE_LESSON_V2_SETITEM",
            arg: {
              item: {
                ...item,
                relativePos: startPos,
              },
            },
          });
          updateItem<typeof item>({ ...item, relativePos: startPos }, item._id);
        });

      return (): void => {
        if (dragContainer.current) interact(dragContainer.current).unset();
      };
    }
    return voidFunction;
  }, [
    dispatch,
    updateDiv,
    dragContainer.current,
    cvResult,
    isOcr,
    pos,
    step,
    item,
    videoScale,
  ]);

  const onSucessCallback = useCallback(
    (trigger: TriggerTypes | null) => {
      if (
        item &&
        onSucess &&
        item.endOn.filter((t) => t.type == trigger).length > 0
      ) {
        onSucess();
      }
    },
    [item]
  );

  if (
    previewing &&
    item &&
    item.anchor &&
    anchor &&
    cvResult.dist < anchor.cvMatchValue / 1000
  ) {
    return <></>;
  }

  const ItemComponent = item ? getItemComponent(item) : undefined;

  return show && ItemComponent && item ? (
    <ItemComponent
      ref={dragContainer}
      pos={pos}
      style={style}
      item={item}
      callback={onSucessCallback}
    />
  ) : (
    <></>
  );
}
