/* eslint-disable global-require */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { animated, useSpring } from "react-spring";
import { ItemFocus } from "../../item";
import { AppState } from "../../../redux/stores/renderer";
import "./index.scss";
import { BaseBoxProps } from "../boxes";
import useItemBehaviour from "../../useItemBehaviour";

export type FindBoxType = "anchor" | "target";

const FindBox = React.forwardRef<HTMLDivElement, BaseBoxProps<ItemFocus>>(
  (props, forwardedRef) => {
    const { item, pos, style, clickThrough, callback } = props;
    const { previewing } = useSelector(
      (state: AppState) => state.createLessonV2
    );

    const [opacity, setOpacity] = useState(previewing ? 0 : 1);

    const [combinedRef] = useItemBehaviour(
      callback,
      forwardedRef,
      clickThrough || false
    );

    let computedType = "type";
    if (item.focus == "Mouse Point") computedType = "mouse";
    if (item.focus == "Rectangle") computedType = "rectangle";
    if (item.focus == "Area highlight") computedType = "area";

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
        ref={combinedRef}
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
      />
    );
  }
);

FindBox.displayName = "FindBox";

export default FindBox;
