/* eslint-disable global-require */
/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { animated, useSpring } from "react-spring";
import getPrimaryMonitor from "../../../../utils/electron/getPrimaryMonitor";
import { ItemFocus } from "../../item";
import { voidFunction } from "../../../constants";
import { AppState } from "../../../redux/stores/renderer";
import "./index.scss";
import { BaseBoxProps } from "../boxes";

export type FindBoxType = "anchor" | "target";

const FindBox = React.forwardRef<HTMLDivElement, BaseBoxProps<ItemFocus>>(
  (props, forwardedRef) => {
    const { item, pos, style, clickThrough, callback } = props;
    const { previewing } = useSelector(
      (state: AppState) => state.createLessonV2
    );

    const [opacity, setOpacity] = useState(previewing ? 0 : 1);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    let computedType = "type";
    if (item.focus == "Mouse Point") computedType = "mouse";
    if (item.focus == "Rectangle") computedType = "rectangle";
    if (item.focus == "Area highlight") computedType = "area";

    const clickCallback = useCallback(
      (e: { x: number; y: number; button: number }) => {
        if (
          e.x > pos.x &&
          e.y > pos.y &&
          e.x < pos.x + pos.width &&
          e.y < pos.y + pos.height &&
          callback
        ) {
          callback("mouse-left");
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
            callback("mouse-hover");
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
          ...(previewing
            ? spring
            : {
                left: `${pos.x - 3}px`,
                top: `${pos.y - 3}px`,
                width: `${pos.width}px`,
                height: `${pos.height}px`,
                opacity,
              }),
          ...style,
        }}
        onClick={callback ? () => callback("mouse-left") : voidFunction}
      />
    );
  }
);

FindBox.displayName = "FindBox";

export default FindBox;
