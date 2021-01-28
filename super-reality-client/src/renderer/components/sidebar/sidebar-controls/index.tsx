import React, { useCallback, useEffect, useRef } from "react";
import "./index.scss";

import interact from "interactjs";
import { useDispatch, useSelector } from "react-redux";
import { animated, useSpring } from "react-spring";
import { cursorChecker, restrictRoot, voidFunction } from "../../../constants";
import clamp from "../../../../utils/clamp";

import { ReactComponent as PinIcon } from "../../../../assets/svg/win-pin.svg";
// import { ReactComponent as MinimizeIcon } from "../../../../assets/svg/win-minimize.svg";
// import { ReactComponent as CloseIcon } from "../../../../assets/svg/win-close.svg";
import closeWindow from "../../../../utils/electron/closeWindow";
import minimizeWindow from "../../../../utils/electron/minimizeWindow";
import { AppState } from "../../../redux/stores/renderer";
import reduxAction from "../../../redux/reduxAction";

interface SidebarControlsProps {
  setWideView: () => void;
  wideView?: boolean;
  sidebarRef: React.RefObject<HTMLDivElement>;
}

export default function SidebarControls(props: SidebarControlsProps) {
  const { setWideView, wideView, sidebarRef } = props;
  const draggableRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const { topMost } = useSelector((state: AppState) => state.render);

  const setTopMost = useCallback(() => {
    reduxAction(dispatch, {
      type: "SET_TOPMOST",
      arg: !topMost,
    });
  }, [topMost, dispatch]);

  const buttonsProps = useSpring({
    left: wideView ? "8px" : "2px",
  });

  useEffect(() => {
    if (draggableRef.current) {
      interact(draggableRef.current)
        .draggable({ cursorChecker, modifiers: [restrictRoot] })
        .on("dragmove", (event) => {
          if (sidebarRef.current) {
            const x = parseFloat(sidebarRef.current.style.right) - event.dx;
            const y = parseFloat(sidebarRef.current.style.top) + event.dy;
            const rootHeight =
              (document.getElementById("root")?.offsetHeight || 99999) -
              (sidebarRef.current?.offsetHeight || 0);

            sidebarRef.current.style.right = `${Math.max(0, x)}px`;
            sidebarRef.current.style.top = `${clamp(0, rootHeight, y)}px`;
          }
        });

      return (): void =>
        interact(draggableRef.current as HTMLDivElement).unset();
    }
    return voidFunction;
  }, [sidebarRef]);

  return (
    <div className="sidebar-controls-container">
      <animated.div style={buttonsProps} className="buttons">
        <div className={`pin ${topMost ? "active" : ""}`} onClick={setTopMost}>
          <PinIcon
            style={{ width: "13px", height: "13px" }}
            fill="var(--color-light)"
          />
        </div>
        <div className="minimize" onClick={minimizeWindow} />
        <div className="close" onClick={closeWindow} />
      </animated.div>
      <div ref={draggableRef} onClick={setWideView} className="logo" />
    </div>
  );
}
