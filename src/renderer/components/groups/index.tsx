import React from "react";
import { useSelector } from "react-redux";
import { Group } from "../../../types/chat";
import { AppState } from "../../redux/stores/renderer";
import usePopupCreateGroup from "../../hooks/usePopupCreateChatItem";
import "./index.scss";
import ButtonSimple from "../button-simple";
import {
  createGroup,
  updateGroup,
  deleteGroup,
} from "../../../utils/chat-utils/groups-services";

interface GroupProps {
  group: Group;
  loginData: any;
}

function SingleGroup(props: GroupProps) {
  const { group, loginData } = props;

  const { users } = group;

  const joinGroup = (groupId: string) => {
    const { _id } = loginData.user;

    const isUserInGroup = users.findIndex((id) => id === _id);
    const addGroupUser = [...users, _id];
    if (isUserInGroup == -1) updateGroup(groupId, { users: addGroupUser });
    console.log(groupId, isUserInGroup, "join the group");
  };

  return (
    <div className="group-card" key={group._id}>
      <div className="group-name">{group.groupName}</div>
      {group.groupPhoto && (
        <img className="group-avatar" src={group.groupPhoto} alt="" />
      )}
      <div className="mebmbers-number">Group members:{group.users.length}</div>
      <ButtonSimple
        onClick={() => {
          joinGroup(group._id);
        }}
      >
        {" "}
        Join the group
      </ButtonSimple>
      <ButtonSimple
        onClick={() => {
          deleteGroup(group._id);
        }}
      >
        {" "}
        del
      </ButtonSimple>
    </div>
  );
}

// Render list of the Groups
function GroupsList() {
  const { groups, loginData } = useSelector((state: AppState) => state.chat);

  return (
    <div className="channel-container groups-list">
      {groups.map((group: Group) => {
        return (
          <SingleGroup key={group._id} group={group} loginData={loginData} />
        );
      })}
    </div>
  );
}
export default function GroupsPage() {
  const [CreateGroupMenu, openGroupPopup] = usePopupCreateGroup({
    createItem: createGroup,
  });
  return (
    <div className="groups-page">
      <div className="create-group-button" onClick={openGroupPopup}>
        Create New Group
      </div>
      <CreateGroupMenu width="300px" height="200px" itemType="Group" />
      <GroupsList />
    </div>
  );
}
