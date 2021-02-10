import React from "react";
import { useDispatch } from "react-redux";
import { animated, useSpring, useTrail } from "react-spring";
import { Category, Channel, Group } from "../../../../types/chat";
import reduxAction from "../../../redux/reduxAction";

// const groups = [
//   {
//     title: "GameGen",
//     icon: "https://i.ytimg.com/vi/ovS4-DrrOqo/maxresdefault.jpg",
//   },
//   {
//     title: "JavaScript",
//     icon:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/480px-Unofficial_JavaScript_logo_2.svg.png",
//   },
//   {
//     title: "TypeScript",
//     icon:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFWV_HgLeNqL2chI-m3M5KbhzUHceEZe9obw&usqp=CAU",
//   },
// ];

interface GroupsListProps {
  click: (id: string) => void;
  currentSub: string | undefined;
  groups: Group[];
  categories: Category[];
  channels: Channel[];
}

export default function GroupsList(props: GroupsListProps) {
  const { click, currentSub, groups, categories, channels } = props;
  const dispatch = useDispatch();
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

  const setActiveGroup = (groupId: string) => {
    reduxAction(dispatch, {
      type: "SET_ACTIVE_GROUP",
      arg: groupId,
    });
    const activeCategory = categories.find(
      (category: Category) => category.groupId === groupId
    );
    console.log("activeCategory", activeCategory);
    if (activeCategory) {
      const activeChannel = channels.find(
        (channel: Channel) => channel.categoryId === activeCategory._id
      );
      console.log("activeChannel", activeChannel);
      if (activeChannel) {
        reduxAction(dispatch, {
          type: "SET_ACTIVE_CHANNEL",
          arg: activeChannel._id,
        });
      } else {
        reduxAction(dispatch, {
          type: "SET_ACTIVE_CHANNEL",
          arg: "",
        });
      }
    }
  };
  // useChain([heightRef, actionsRef] as any);

  return (
    <animated.div style={heightProps}>
      {groups.map((group, index) => {
        return (
          <animated.div
            style={{ ...actionAnimation[index], position: "relative" }}
            className="action-button-container"
            onClick={() => {
              click(group.groupName);
              setActiveGroup(group._id);
            }}
            key={group.groupName}
          >
            <div
              className="action-button-image"
              style={{ backgroundImage: `url(${group.groupPhoto})` }}
            />
            <div style={{ left: "8px" }} className="action-button-title">
              {group.groupName}
            </div>
            {currentSub == group.groupName ? (
              <div className="action-button-selected" />
            ) : (
              <></>
            )}
          </animated.div>
        );
      })}
    </animated.div>
  );
}
