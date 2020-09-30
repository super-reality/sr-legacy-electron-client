import React, { useEffect, useLayoutEffect, useRef } from "react";
import interact from "interactjs";
import "./index.scss";

const restrictMinSize =
  interact.modifiers &&
  interact.modifiers.restrictSize({
    min: { width: 100, height: 100 },
  });

const cursorChecker: any = (
  action: any,
  _interactable: any,
  _element: any,
  interacting: boolean
): string => {
  switch (action.axis) {
    case "x":
      return "ew-resize";
    case "y":
      return "ns-resize";
    default:
      return interacting ? "grabbing" : "grab";
  }
};

function Windowlet() {
  const dragContainer = useRef<HTMLDivElement>(null);
  const resizeContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dragContainer.current) {
      interact(dragContainer.current)
        .draggable({ cursorChecker })
        .on("dragmove", (event) => {
          if (resizeContainer.current) {
            const x = parseFloat(resizeContainer.current.style.left) + event.dx;
            const y = parseFloat(resizeContainer.current.style.top) + event.dy;
            resizeContainer.current.style.left = `${x}px`;
            resizeContainer.current.style.top = `${y}px`;
          }
        });

      return (): void =>
        interact(dragContainer.current as HTMLDivElement).unset();
    }
    return () => {};
  }, []);

  useEffect(() => {
    if (resizeContainer.current) {
      interact(resizeContainer.current)
        .resizable({
          edges: { left: true, right: true, bottom: true, top: true },
          modifiers: [restrictMinSize],
          inertia: true,
        } as any)
        .on("resizemove", (event) => {
          const { target } = event;
          const x = parseFloat(target.style.left) + event.deltaRect.left;
          const y = parseFloat(target.style.top) + event.deltaRect.top;
          // fix for interact.js adding 4px to height/width on resize
          target.style.width = `${event.rect.width - 4}px`;
          target.style.height = `${event.rect.height - 4}px`;
          target.style.left = `${x}px`;
          target.style.top = `${y}px`;
        });

      return (): void =>
        interact(resizeContainer.current as HTMLDivElement).unset();
    }
    return () => {};
  }, []);

  return (
    <div
      className="window-container click-on"
      ref={resizeContainer}
      style={{
        border: `1px solid rgba(128, 128, 128, 0.5)`,
        opacity: "1",
        visibility: "visible",
        height: `${0}px`,
        width: `${0}px`,
        left: `${0}px`,
        top: `${0}px`,
      }}
    >
      <div ref={dragContainer} className="title-bar" />
    </div>
  );
}

export default function CreateLessonDetached(): JSX.Element {
  useEffect(() => {
    document.body.style.backgroundColor = "rgba(0, 0, 0, 0)";
  }, []);

  useLayoutEffect(() => {
    // eslint-disable-next-line global-require
    const { remote } = require("electron");
    const { setIgnoreMouseEvents } = remote.getCurrentWindow();

    let t: NodeJS.Timeout;

    window.addEventListener("mousemove", (event) => {
      const target = event.target as HTMLElement;
      if (
        target?.classList?.contains("click-through") ||
        target?.id == "root"
      ) {
        setIgnoreMouseEvents(true, { forward: true });
        if (t) clearTimeout(t);
        t = setTimeout(() => {
          setIgnoreMouseEvents(false);
        }, 150);
      } else setIgnoreMouseEvents(false);
    });
  }, []);

  return (
    <div className="transparent-container click-through">
      <Windowlet />
    </div>
  );
}
