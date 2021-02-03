import React from "react";
import { useSelector } from "react-redux";
import { Group } from "../../../types/chat";
import { AppState } from "../../redux/stores/renderer";
import client from "../../feathers";
import usePopupCreateGroup from "../../hooks/usePopupCreateChatItem";
import "./index.scss";
import ButtonSimple from "../button-simple";
import { updateGroup } from "../../../utils/chat-utils/services";

interface GroupProps {
  group: Group;
  loginData: any;
}
const groupClient = client.service("collectives");

function SingleGroup(props: GroupProps) {
  const { group, loginData } = props;

  const { users } = group;
  const deleteGroup = () => {
    groupClient.remove(group._id);
  };

  const joinGroup = (groupId: string) => {
    const { _id } = loginData.user;

    const isUserInGroup = users.findIndex((id) => id === _id);
    const addGroupUser = [...users, _id];
    if (isUserInGroup == -1) updateGroup(groupId, { users: addGroupUser });
    console.log(groupId, isUserInGroup, "join the group");
  };

  return (
    <div className="group-card" key={group._id}>
      <div className="group-name">{group.collectiveName}</div>
      {group.collectivePhoto && (
        <img className="group-avatar" src={group.collectivePhoto} alt="" />
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
      <ButtonSimple onClick={deleteGroup}> del</ButtonSimple>
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
  const createGroup = (gName: string, gPhoto?: string) => {
    let groupProps;
    if (gPhoto) {
      groupProps = {
        collectiveName: gName,
        collectivePhoto: gPhoto,
      };
      console.log("groupProps", groupProps);
    } else {
      groupProps = {
        collectiveName: gName,
      };
    }
    console.log("groupProps", groupProps);
    groupClient.create(groupProps).catch((err: any) => {
      console.log(err);
    });
  };

  const [CreateGroupMenu, openGroupPopup] = usePopupCreateGroup({
    createItem: createGroup,
  });
  return (
    <div className="groups-page">
      <div className="create-group-button" onClick={openGroupPopup}>
        Create New Group
      </div>
      <CreateGroupMenu
        width="400px"
        height="200px"
        style={{
          right: "300px",
        }}
        itemType="Group"
      />
      <GroupsList />
    </div>
  );
}
