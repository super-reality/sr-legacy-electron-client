import React, { useCallback, useState } from "react";
import "./index.scss";
import { animated, useTrail } from "react-spring";
import { SidebarIcon } from "..";
import ButtonRound from "../../button-round";

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

  const toggleOpen = useCallback(
    (index: number) => {
      const newGroups = [...openGroups];
      newGroups[index] = !openGroups[index];
      setOpenGroups(newGroups);
    },
    [openGroups]
  );

  const toggleClose = useCallback(
    (index: number) => {
      const newGroups = [...openGroups];
      newGroups[index] = false;
      setOpenGroups(newGroups);
    },
    [openGroups]
  );

  return (
    <div className="action-buttons">
      {sidebarIcons.map((icon, index) => {
        const Group = icon.subComponent as any;
        return (
          <>
            <div
              className="action-button-container"
              onClick={() => {
                if (icon.subComponent && expanded) toggleOpen(index);
                else toggleClose(index);
                if (!icon.subComponent) clickButton(index);
              }}
              key={icon.title}
            >
              <ButtonRound
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (openGroups[index] == true) toggleClose(index);
                  clickButton(index);
                }}
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
            {openGroups[index] == true && icon.subComponent ? <Group /> : <></>}
          </>
        );
      })}
    </div>
  );
}
