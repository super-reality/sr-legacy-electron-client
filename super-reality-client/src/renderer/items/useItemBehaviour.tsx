import { useCallback, useEffect, useRef } from "react";
import { Rectangle } from "../../types/utils";
import getPrimaryMonitor from "../../utils/electron/getPrimaryMonitor";
import globalData from "../globalData";
import { TriggerTypes } from "./endStep";

export default function useItemBehaviour(
  callback: ((trigger: TriggerTypes | null) => void) | undefined,
  pos: Rectangle,
  clickThrough: boolean
) {
  const lastClickRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clickCallback = useCallback(() => {
    if (
      globalData.mouseX > pos.x &&
      globalData.mouseY > pos.y &&
      globalData.mouseX < pos.x + pos.width &&
      globalData.mouseY < pos.y + pos.height &&
      callback
    ) {
      const timeNow = new Date().getTime();
      console.log("CLICK", timeNow - lastClickRef.current);
      if (timeNow - lastClickRef.current < 500) {
        callback("mouse-double");
      } else {
        callback("mouse-left");
      }
      lastClickRef.current = timeNow;
    }
  }, [callback, pos]);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    const mouseEvents = __non_webpack_require__("global-mouse-events");

    if (callback) {
      const interval = setInterval(() => {
        const diplayPos = getPrimaryMonitor().bounds;
        if (
          globalData.mouseX > diplayPos.x + pos.x &&
          globalData.mouseY > diplayPos.y + pos.y &&
          globalData.mouseX < diplayPos.x + pos.x + pos.width &&
          globalData.mouseY < diplayPos.y + pos.y + pos.height
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

  return clickCallback;
}
