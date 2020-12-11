import React, {
  CSSProperties,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "./index.scss";
import interact from "interactjs";
import { animated, useSpring } from "react-spring";
import { ReactComponent as CloseIcon } from "../../../assets/svg/win-close.svg";
import { ReactComponent as MinimizeIcon } from "../../../assets/svg/win-minimize.svg";
import {
  cursorChecker,
  restrictMinSize,
  restrictRoot,
  voidFunction,
} from "../../constants";
import getPrimaryMonitor from "../../../utils/electron/getPrimaryMonitor";
import clamp from "../../../utils/clamp";

interface WindowletProps {
  title: string;
  style?: CSSProperties;
  width?: number;
  height?: number;
  initialPosX?: number;
  initialPosY?: number;
  initialLeft?: string;
  initialTop?: string;
  onClose: () => void;
  onMinimize?: () => void;
}

export default function Windowlet(props: PropsWithChildren<WindowletProps>) {
  const {
    children,
    style,
    title,
    height,
    width,
    onMinimize,
    onClose,
    initialPosX,
    initialPosY,
    initialLeft,
    initialTop,
  } = props;
  const dragContainer = useRef<HTMLDivElement>(null);
  const resizeContainer = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<boolean>(false);

  const update = useCallback(() => {
    if (!state) {
      if (onClose) onClose();
    }
  }, [onClose, state]);

  const springConfig = { mass: 3, tension: 1000, friction: 100 };
  const alphaSpring = useSpring({
    opacity: state ? 1 : 0,
    config: springConfig,
    onRest: update,
  }) as any;
  const scaleSpring = useSpring({
    transform: `scale(${state ? 1 : 0.8})`,
    config: springConfig,
  }) as any;

  useEffect(() => {
    setState(true);
  }, []);

  useEffect(() => {
    if (resizeContainer.current) {
      resizeContainer.current.style.width = `${width || 400}px`;
      resizeContainer.current.style.height = `${height || 200}px`;

      const display = getPrimaryMonitor();
      const primarySize = display.workArea;
      const primaryPos = display.bounds;

      const screenWidth =
        primarySize?.width ||
        document.getElementById("root")?.offsetWidth ||
        window.screen.width;
      const screenHeight =
        primarySize?.height ||
        document.getElementById("root")?.offsetHeight ||
        window.screen.height;

      const windowletWidth = width || 400;
      const windowletHeight = height || 200;

      if (initialPosX) {
        resizeContainer.current.style.left = `${
          ((screenWidth - windowletWidth) / 100) * initialPosX
        }px`;
      } else {
        resizeContainer.current.style.left = `${
          screenWidth / 2 - windowletWidth / 2
        }px`;
      }
      if (initialPosY) {
        resizeContainer.current.style.top = `${
          primaryPos.y + ((screenHeight - windowletHeight) / 100) * initialPosY
        }px`;
      } else {
        resizeContainer.current.style.top = `${
          primaryPos.y + screenHeight / 2 - windowletHeight / 2
        }px`;
      }

      if (initialLeft) {
        resizeContainer.current.style.left = initialLeft;
      }
      if (initialTop) {
        resizeContainer.current.style.top = initialTop;
      }
    }
  }, []);

  useEffect(() => {
    if (dragContainer.current) {
      interact(dragContainer.current)
        .draggable({ cursorChecker, modifiers: [restrictRoot] })
        .on("dragmove", (event) => {
          if (resizeContainer.current) {
            const x = parseFloat(resizeContainer.current.style.left) + event.dx;
            const y = parseFloat(resizeContainer.current.style.top) + event.dy;

            const rootHeight =
              (document.getElementById("root")?.offsetHeight || 99999) -
              (resizeContainer.current?.offsetHeight || 0);

            resizeContainer.current.style.left = `${x}px`;
            resizeContainer.current.style.top = `${clamp(0, rootHeight, y)}px`;
          }
        });

      return (): void =>
        interact(dragContainer.current as HTMLDivElement).unset();
    }
    return voidFunction;
  }, [dragContainer, resizeContainer]);

  useEffect(() => {
    if (resizeContainer.current) {
      interact(resizeContainer.current)
        .resizable({
          edges: { left: true, right: true, bottom: true, top: true },
          margin: 16,
          modifiers: [restrictMinSize],
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
    return voidFunction;
  }, [resizeContainer]);

  return (
    <animated.div
      className="window-container click-on"
      ref={resizeContainer}
      style={{
        border: `1px solid rgba(128, 128, 128, 0.3)`,
        opacity: "1",
        visibility: "visible",
        ...style,
        ...alphaSpring,
        ...scaleSpring,
      }}
    >
      <div ref={dragContainer} className="title-bar">
        <div>{title}</div>
        <div className="buttons">
          {onMinimize && (
            <div className="minimize" onClick={onMinimize}>
              <MinimizeIcon style={{ margin: "auto" }} />
            </div>
          )}
          <div className="close" onClick={() => setState(false)}>
            <CloseIcon style={{ margin: "auto" }} fill="var(--color-icon)" />
          </div>
        </div>
      </div>
      <div className="window-content-container">{children}</div>
    </animated.div>
  );
}
