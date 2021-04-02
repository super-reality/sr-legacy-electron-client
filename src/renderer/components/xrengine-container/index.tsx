/* eslint-disable @typescript-eslint/no-unused-vars */
import interact from "interactjs";
import React, { useEffect, useRef } from "react";
// import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
// import Harmony from "xr3ngine-client-core/components/ui/Harmony";
import getPrimaryMonitor from "../../../utils/electron/getPrimaryMonitor";
import minimizeWindow from "../../../utils/electron/minimizeWindow";
import { voidFunction } from "../../constants";
import useTransparentFix from "../../hooks/useTransparentFix";
// import interact from "interactjs";
import ShootingStar from "../animations";
import TopMenuBar from "../top-menu-bar";
import Windowlet from "../windowlet";

const restrictMinSize =
  interact.modifiers &&
  interact.modifiers.restrictSize({
    min: { width: 100, height: 100 },
  });

export default function XREngineContainer() {
  const resizeContainer = useRef<HTMLDivElement>(null);

  //   const dispatch = useDispatch();
  const history = useHistory();
  useTransparentFix(false);

  useEffect(() => {
    if (resizeContainer.current) {
      interact(resizeContainer.current)
        .resizable({
          edges: { left: false, right: true, bottom: false, top: false },
          modifiers: [restrictMinSize],
          inertia: true,
        } as any)
        .on("resizemove", (event) => {
          const { target } = event;
          target.style.width = `${event.rect.width - 4}px`;
        });

      return (): void => {
        if (resizeContainer.current) interact(resizeContainer.current).unset();
      };
    }
    return voidFunction;
  }, [resizeContainer]);
  const primarySize = getPrimaryMonitor().workArea;

  return (
    <Windowlet
      width={primarySize.width}
      height={primarySize.height}
      title="Super Reality"
      topBarContent={<TopMenuBar />}
      onMinimize={minimizeWindow}
      onClose={() => history.push("/")}
    >
      <div className="main-container">
        <div className="edit">
          <div
            className="creator"
            style={{ width: "340px" }}
            ref={resizeContainer}
          >
            {/* For shooting star animation - START */}
            <ShootingStar
              style={{ animationDelay: "1.5s", top: 0 }}
              direction="right"
            />
            <ShootingStar
              style={{ animationDelay: "1.75s", right: 0 }}
              direction="bottom"
            />
            {/* For shooting start animation - END */}
          </div>
          {/* {openPanel && <LeftPanelWrapper />} */}
          <div className="animate-gradient preview">
            {/* For shooting star animation - START */}
            <ShootingStar
              style={{ animationDelay: "2s", bottom: 0 }}
              direction="right"
            />
            <ShootingStar
              style={{ animationDelay: "1.75s", left: 0 }}
              direction="bottom"
            />
            {/* For shooting start animation - END */}
            {/* <Harmony setLeftDrawerOpen setRightDrawerOpen /> */}
          </div>
        </div>
      </div>
    </Windowlet>
  );
}
