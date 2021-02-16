import React, { useCallback, useEffect, useState } from "react";
import "./index.scss";
import { animated, useTrail } from "react-spring";
import { SidebarIcon } from "..";
import ButtonRound from "../../button-round";
import { voidFunction } from "../../../constants";

interface ActionButtonsProps {
  expanded: boolean;
  clickButton: (id: number) => void;
  sidebarIcons: SidebarIcon[];
}

export default function ActionButtons(props: ActionButtonsProps) {
  const { expanded, clickButton, sidebarIcons } = props;

  const actionAnimation = useTrail(sidebarIcons.length, {
    config: { mass: 5, tension: 2000, friction: 180 },
    width: expanded ? 152 : 0,
    opacity: expanded ? 1 : 0,
    left: expanded ? 8 : 40,
    from: { width: 0, opacity: 0, left: 40 },
  } as any);

  const [openGroups, setOpenGroups] = useState<boolean[]>(
    sidebarIcons.map(() => false)
  );

  const groupToggle = useCallback(
    (index: number) => {
      const newGroups = [...openGroups];
      newGroups[index] = !openGroups[index];
      setOpenGroups(newGroups);
    },
    [openGroups]
  );

  const groupClose = useCallback(
    (index: number) => {
      const newGroups = [...openGroups];
      newGroups[index] = false;
      setOpenGroups(newGroups);
    },
    [openGroups]
  );

  useEffect(() => setOpenGroups(sidebarIcons.map(() => false)), [expanded]);

  return (
    <div className="action-buttons" onMouseOut={(e) => e.stopPropagation()}>
      {sidebarIcons.map((icon, index) => {
        return (
          <>
            <div
              className="action-button-container"
              onClick={() => {
                if (!expanded && icon.subComponent) clickButton(index);
                if (expanded && icon.subComponent) groupToggle(index);
                else groupClose(index);
                if (!icon.subComponent) clickButton(index);
              }}
              onMouseOver={() => {
                if (expanded && icon.subComponent) groupToggle(index);
                else groupClose(index);
              }}
              key={icon.title}
            >
              <ButtonRound
                onClick={voidFunction}
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
            {openGroups[index] == true && icon.subComponent
              ? icon.subComponent
              : undefined}
          </>
        );
      })}
    </div>
  );
}
