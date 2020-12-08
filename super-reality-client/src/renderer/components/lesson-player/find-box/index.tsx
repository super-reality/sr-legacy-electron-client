/* eslint-disable global-require */
/* eslint-disable react/prop-types */
import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { animated, useSpring } from "react-spring";
import getPrimaryMonitor from "../../../../utils/electron/getPrimaryMonitor";
import { ItemFocus, ItemFocusTriggers } from "../../../api/types/item/item";
import { voidFunction } from "../../../constants";
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
    const [opacity, setOpacity] = useState(0);
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
          const diplayPos = getPrimaryMonitor().bounds;
          if (
            mouse.x > diplayPos.x + pos.x &&
            mouse.y > diplayPos.y + pos.y &&
            mouse.x < diplayPos.x + pos.x + pos.width &&
            mouse.y < diplayPos.y + pos.y + pos.height
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
      opacity,
    }) as any;

    useEffect(() => {
      setTimeout(() => setOpacity(1), 1000);
    }, []);

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
