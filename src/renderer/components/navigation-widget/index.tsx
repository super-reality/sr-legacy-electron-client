/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { animated, useTransition } from "react-spring";
import "./styles.scss";
import ShootingStar from "../animations";
import pinIcon from "../../../assets/images/sidebar-logo.png";
import hexaconIcon from "../../../assets/svg/hexacon.svg";

interface INavWidget {
  show?: boolean;
}

const NavigationWidget = ({ show = true }: INavWidget) => {
  const transitions = useTransition(show, {
    from: { opacity: 0 },
    enter: () => async (next, _) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await next({ opacity: 1 });
    },
    leave: { opacity: 0 },
  });

  if (!show) return null;

  return (
    <animated.div className="hexr-container">
      <img src={hexaconIcon} alt="Hexacon" />
      {transitions(
        (props, item) =>
          item && (
            <ShootingStar top bottom>
              <animated.div style={props as any} className="hexr-center" />
            </ShootingStar>
          )
      )}
      {/* <img style={{ width: "120px" }} src={pinIcon} alt="SR logo" /> */}
      <img src={hexaconIcon} alt="Hexacon" />
    </animated.div>
  );
};

export default NavigationWidget;
