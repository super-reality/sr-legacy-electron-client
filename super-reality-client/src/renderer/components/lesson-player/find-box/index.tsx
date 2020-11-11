/* eslint-disable global-require */
/* eslint-disable react/prop-types */
import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { ReactComponent as AnchorIcon } from "../../../../assets/svg/anchor.svg";
import {
  ItemFocus,
  ItemFocusTriggers,
  ItemFX,
  ItemFXTriggers,
} from "../../../api/types/item/item";
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
  type: ItemFX["effect"] | ItemFocus["focus"] | "anchor";
  ref?: React.RefObject<HTMLDivElement>;
  clicktThrough?: boolean;
  callback?: (trigger: number) => void;
}

const FindBox = React.forwardRef<HTMLDivElement, FindBoxProps>(
  (props, forwardedRef) => {
    const { type, pos, style, clicktThrough, callback } = props;
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    // test FX
    const { testFX } = useSelector((state: AppState) => state.createLessonV2);
    const [currentEffect, setcurrentEffect] = useState("../fx-wavy");
    useEffect(() => {
      if (testFX.effect == "id_1") setcurrentEffect("../fx-wavy/");
      if (testFX.effect == "id_2") setcurrentEffect("../fx-confetti/");
      if (testFX.effect == "id_3") setcurrentEffect("../fx-orb/");
    }, [testFX.effect]);

    let computedType = "type";
    if (type == "anchor") computedType = "anchor";
    if (type == "Mouse Point") computedType = "mouse";
    if (type == "Rectangle") computedType = "rectangle";
    if (type == "Area highlight") computedType = "area";
    if (type == "id_1") computedType = "area";

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

      if (clicktThrough && callback) {
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
        }, 500);
        timeoutRef.current = interval;

        mouseEvents.on("mousedown", clickCallback);
      }

      return () => {
        if (timeoutRef.current) clearInterval(timeoutRef.current);
        mouseEvents.removeListener("mousedown", clickCallback);
      };
    }, [pos, callback]);

    return (
      <div
        ref={forwardedRef}
        className={`find-box ${
          clicktThrough ? "click-through" : ""
        } ${computedType}`}
        style={{
          left: `${pos.x - 3}px`,
          top: `${pos.y - 3}px`,
          width: `${pos.width}px`,
          height: `${pos.height}px`,
          ...style,
        }}
        onClick={
          callback
            ? () => callback(ItemFocusTriggers["Click target"])
            : voidFunction
        }
      >
        {type == "anchor" && pos.width > 150 && pos.height > 150 && (
          <AnchorIcon
            fill="var(--color-red)"
            style={{ opacity: 0.66, margin: "auto" }}
          />
        )}
        <iframe
          style={{
            width: "1050px",
            height: "550px",
          }}
          className="fx-iframe click-through"
          src={currentEffect}
        />
      </div>
    );
  }
);

FindBox.displayName = "FindBox";

export default FindBox;
