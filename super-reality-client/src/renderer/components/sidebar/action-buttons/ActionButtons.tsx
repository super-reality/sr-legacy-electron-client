import React from "react";
import { animated, useTrail } from "react-spring";
import { SidebarIcon } from "..";
import ButtonRound from "../../button-round";

interface ActionButtonsProps {
  current: number;
  expanded: boolean;
  clickButton: (id: number) => void;
  sidebarIcons: SidebarIcon[];
}

export default function ActionButtons(props: ActionButtonsProps) {
  const { current, expanded, clickButton, sidebarIcons } = props;

  const actionAnimation = useTrail(sidebarIcons.length, {
    config: { mass: 5, tension: 2000, friction: 180 },
    width: expanded ? 152 : 0,
    opacity: expanded ? 1 : 0,
    left: expanded ? 8 : 40,
    from: { width: 0, opacity: 0, left: 64 },
  } as any);

  return (
    <div className="action-buttons">
      {sidebarIcons.map((icon, index) => {
        return (
          <>
            <div className="action-button-container" key={icon.title}>
              <ButtonRound
                onClick={() => clickButton(index)}
                width="32px"
                height="32px"
                svg={icon.icon}
                title={icon.title}
              />
              <animated.div
                style={actionAnimation[index]}
                className="action-button-title"
              >
                {icon.title}
              </animated.div>
            </div>
            {current == index && icon.subComponent ? icon.subComponent : <></>}
          </>
        );
      })}
    </div>
  );
}
