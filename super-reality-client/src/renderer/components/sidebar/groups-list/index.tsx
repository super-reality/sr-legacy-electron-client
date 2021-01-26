import React from "react";
import { animated, useSpring, useTrail } from "react-spring";

const groups = [
  {
    title: "GameGen",
    icon: "https://i.ytimg.com/vi/ovS4-DrrOqo/maxresdefault.jpg",
  },
  {
    title: "JavaScript",
    icon:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/480px-Unofficial_JavaScript_logo_2.svg.png",
  },
  {
    title: "TypeScript",
    icon:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFWV_HgLeNqL2chI-m3M5KbhzUHceEZe9obw&usqp=CAU",
  },
];

export default function GroupsList() {
  const actionAnimation = useTrail(groups.length, {
    config: { mass: 5, tension: 2000, friction: 180 },
    opacity: 1,
    left: 0,
    from: { opacity: 0, left: 32 },
  } as any);

  const heightProps = useSpring({
    config: { mass: 5, tension: 2000, friction: 200, velocity: 3 },
    height: 33 * groups.length,
    from: { height: 0 },
  } as any);

  // useChain([heightRef, actionsRef] as any);

  return (
    <animated.div style={heightProps}>
      {groups.map((group, index) => {
        return (
          <animated.div
            style={{ ...actionAnimation[index], position: "relative" }}
            className="action-button-container"
            onClick={() => console.log(group.title)}
            key={group.title}
          >
            <div
              className="action-button-image"
              style={{ backgroundImage: `url(${group.icon})` }}
            />
            <div style={{ left: "8px" }} className="action-button-title">
              {group.title}
            </div>
          </animated.div>
        );
      })}
    </animated.div>
  );
}
