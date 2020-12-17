import React from "react";
// import { Group } from "../../common/interfaces/Group";

interface GroupsListProps {
  groups: any[];
  callback: (group: any) => void;
  activeGroupId: string;
}

interface GroupProps {
  group: any;
  activeGroupId: string;
  makeGroupActive: (group: any) => void;
}

const GroupItem = (props: GroupProps): JSX.Element => {
  const { group, activeGroupId, makeGroupActive } = props;
  const { name } = group.group;
  // (group.channelType === "group") ? group.name : (group.channelType === "party") ?
  console.log("GroupItem", group, name, activeGroupId);
  return (
    <div
      className={`group `}
      style={{
        display: "flex",
      }}
      onClick={() => {
        makeGroupActive(group);
      }}
    >
      <div>{name}</div>
    </div>
  );
};

export default function GroupsList(props: GroupsListProps): JSX.Element {
  const { groups, callback, activeGroupId } = props;
  console.log("groups.length", groups.length);
  return (
    <div className="groups-list">
      {groups.map((group: any) => {
        console.log("group item map");
        return (
          <GroupItem
            key={group.id}
            group={group}
            makeGroupActive={callback}
            activeGroupId={activeGroupId}
          />
        );
      })}
    </div>
  );
}
