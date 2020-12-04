/* eslint-disable global-require */
/* eslint-disable react/prop-types */
import React, { CSSProperties, useCallback, useEffect, useRef } from "react";
import { animated, useSpring } from "react-spring";
import { ReactComponent as AnchorIcon } from "../../../../assets/svg/anchor.svg";
import { ItemFocus, ItemFocusTriggers } from "../../../api/types/item/item";
import { voidFunction } from "../../../constants";
import { AppState } from "../../../redux/stores/renderer";
import "./index.scss";

export type FindBoxType = "anchor" | "target";

interface FindBoxProps {
  pos: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  style?: CSSProperties;
  type: ItemFocus["focus"];
  ref?: React.RefObject<HTMLDivElement>;
  clickThrough?: boolean;
  callback?: (trigger: number) => void;
}

const FindBox = React.forwardRef<HTMLDivElement, FindBoxProps>(
  (props, forwardedRef) => {
    const { type, pos, style, clickThrough, callback } = props;
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    let computedType = "type";
    if (type == "Mouse Point") computedType = "mouse";
    if (type == "Rectangle") computedType = "rectangle";
    if (type == "Area highlight") computedType = "area";

    const clickCallback = useCallback(
      (e: { x: number; y: number; button: number }) => {
        if (
          e.x > pos.x &&
          e.y > pos.y &&
          e.x < pos.x + pos.width &&
          e.y < pos.y + pos.height &&
          callback
        ) {
          callback(ItemFocusTriggers["Click target"]);
        }
      },
      [callback, pos]
    );

    useEffect(() => {
      // eslint-disable-next-line no-undef
      const mouseEvents = __non_webpack_require__("global-mouse-events");
      const { remote } = require("electron");

      if (callback) {
        const interval = setInterval(() => {
          const mouse = remote.screen.getCursorScreenPoint();
          if (
            mouse.x > pos.x &&
            mouse.y > pos.y &&
            mouse.x < pos.x + pos.width &&
            mouse.y < pos.y + pos.height
          ) {
            callback(ItemFocusTriggers["Hover target"]);
          }
        }, 50);
        timeoutRef.current = interval;

        if (clickThrough) {
          mouseEvents.on("mousedown", clickCallback);
        }
      }

      return () => {
        if (timeoutRef.current) clearInterval(timeoutRef.current);
        mouseEvents.removeListener("mousedown", clickCallback);
      };
    }, [pos, callback]);

    const spring = useSpring({
      left: `${pos.x - 3}px`,
      top: `${pos.y - 3}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    }) as any;

    return (
      <animated.div
        ref={forwardedRef}
        className={`find-box ${
          clickThrough ? "click-through" : ""
        } ${computedType}`}
        style={{
          ...spring,
          ...style,
        }}
        onClick={
          callback
            ? () => callback(ItemFocusTriggers["Click target"])
            : voidFunction
        }
      />
    );
  }
);

FindBox.displayName = "FindBox";

export default FindBox;
