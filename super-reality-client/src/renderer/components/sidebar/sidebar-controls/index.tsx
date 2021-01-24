import React, { useCallback, useEffect, useRef, useState } from "react";
import "./index.scss";

import interact from "interactjs";
import { cursorChecker, restrictRoot, voidFunction } from "../../../constants";
import clamp from "../../../../utils/clamp";

import { ReactComponent as PinIcon } from "../../../../assets/svg/win-pin.svg";
import { ReactComponent as MinimizeIcon } from "../../../../assets/svg/win-minimize.svg";
import { ReactComponent as CloseIcon } from "../../../../assets/svg/win-close.svg";
import closeWindow from "../../../../utils/electron/closeWindow";
import minimizeWindow from "../../../../utils/electron/minimizeWindow";
import setTopMost from "../../../../utils/electron/setTopMost";
import setFocusable from "../../../../utils/electron/setFocusable";

interface SidebarControlsProps {
  sidebarRef: React.RefObject<HTMLDivElement>;
}

export default function SidebarControls(props: SidebarControlsProps) {
  const { sidebarRef } = props;
  const draggableRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);

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

            sidebarRef.current.style.right = `${x}px`;
            sidebarRef.current.style.top = `${clamp(0, rootHeight, y)}px`;
          }
        });

      return (): void =>
        interact(draggableRef.current as HTMLDivElement).unset();
    }
    return voidFunction;
  }, [sidebarRef]);

  const onPin = useCallback(() => {
    setPinned(!pinned);
    setFocusable(pinned);
    setTopMost(!pinned);
  }, [pinned]);

  return (
    <div className="sidebar-controls-container">
      <div className="buttons">
        <div className={`pin ${pinned ? "active" : ""}`} onClick={onPin}>
          <PinIcon
            style={{ width: "13px", height: "13px" }}
            fill="var(--color-pink)"
          />
        </div>
        <div className="minimize" onClick={minimizeWindow}>
          <MinimizeIcon />
        </div>
        <div className="close" onClick={closeWindow}>
          <CloseIcon fill="var(--color-pink)" />
        </div>
      </div>
      <div ref={draggableRef} className="logo" />
    </div>
  );
}
