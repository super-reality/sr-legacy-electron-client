import React, {
  CSSProperties,
  PropsWithChildren,
  useEffect,
  useRef,
} from "react";
import interact from "interactjs";
import { ReactComponent as CloseIcon } from "../../../../assets/svg/win-close.svg";

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

interface WindowletProps {
  title: string;
  style?: CSSProperties;
  width?: number;
  height?: number;
  onClose: () => void;
}

export default function Windowlet(props: PropsWithChildren<WindowletProps>) {
  const { children, style, title, height, width, onClose } = props;
  const dragContainer = useRef<HTMLDivElement>(null);
  const resizeContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (resizeContainer.current) {
      resizeContainer.current.style.width = `${width || 400}px`;
      resizeContainer.current.style.height = `${height || 200}px`;
      resizeContainer.current.style.left = `${
        window.screen.width / 2 - (width || 400) / 2
      }px`;
      resizeContainer.current.style.top = `${
        window.screen.height / 2 - (height || 200) / 2
      }px`;
    }
  }, []);

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
        border: `1px solid rgba(128, 128, 128, 0.3)`,
        opacity: "1",
        visibility: "visible",
        ...style,
      }}
    >
      <div ref={dragContainer} className="title-bar">
        <div>{title}</div>
        <div className="close" onClick={onClose}>
          <CloseIcon style={{ margin: "auto" }} fill="var(--color-icon" />
        </div>
      </div>
      {children}
    </div>
  );
}
