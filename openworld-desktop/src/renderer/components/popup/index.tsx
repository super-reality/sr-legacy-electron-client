import React, {
  useCallback,
  useState,
  PropsWithChildren,
  CSSProperties,
} from "react";
import "./index.scss";
import { animated, useSpring } from "react-spring";

type PopupProps = PropsWithChildren<{
  width: string;
  height: string;
  style?: CSSProperties;
}>;

/**
 * Creates a popup window
 * @param open initial open state
 * @param onClose callback on close event
 */
export default function usePopup(
  open: boolean,
  onClose: () => void
): [(props: PopupProps) => JSX.Element, () => void] {
  const [state, setState] = useState({
    display: open,
    open,
  });

  const update = useCallback(() => {
    if (!state.open) {
      onClose();
      setState({ ...state, display: false });
    }
  }, [onClose, state]);

  const doOpen = useCallback(() => {
    setState({ open: true, display: true });
  }, []);

  const beginClose = useCallback(() => {
    setState({ open: false, display: true });
  }, []);

  const springConfig = { mass: 3, tension: 1000, friction: 100 };
  const alphaSpring = useSpring({
    opacity: state.open ? 1 : 0,
    config: springConfig,
    onRest: update,
  }) as any;
  const scaleSpring = useSpring({
    transform: `scale(${state.open ? 1 : 0.8})`,
    config: springConfig,
  }) as any;

  const Component = (props: PopupProps) => {
    const { children, style, width, height } = props;
    return state.display ? (
      <animated.div
        style={alphaSpring}
        className="popup-container"
        onClick={beginClose}
      >
        <animated.div
          className="popup-box"
          style={{
            ...scaleSpring,
            ...style,
            width,
            height,
          }}
          onClick={(e): void => {
            e.stopPropagation();
          }}
        >
          {children}
        </animated.div>
      </animated.div>
    ) : (
      <></>
    );
  };

  return [Component, doOpen];
}
