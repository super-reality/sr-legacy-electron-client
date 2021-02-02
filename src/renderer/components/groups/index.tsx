import React from "react";
import { useSelector } from "react-redux";
import { Group } from "../../../types/chat";
import { AppState } from "../../redux/stores/renderer";
import ButtonAdd from "../../../assets/images/add-btn.png";
import client from "../../feathers";
import usePopupCreateGroup from "../../hooks/usePopupCreateChatItem";
import "./index.scss";
import ButtonSimple from "../button-simple";

interface GroupProps {
  group: Group;
}
const groupClient = client.service("collectives");

function SingleGroup(props: GroupProps) {
  const { group } = props;
  const { users } = useSelector((state: AppState) => state.chat);

  const updateGroup = () => {
    groupClient.patch(group._id, {
      collectiveName: "updated Name",
      collectivePhoto:
        "https://i.pinimg.com/originals/e7/f0/c9/e7f0c9b4cdc731cd9b58077af3854118.jpg",
      users: users,
    });
  };
  const deleteGroup = () => {
    groupClient.remove(group._id);
  };
  return (
    <div className="group-card" key={group._id}>
      <div className="group-name">{group.collectiveName}</div>
      {group.collectivePhoto && (
        <img className="group-avatar" src={group.collectivePhoto} alt="" />
      )}
      <div className="mebmbers-number">Group members:{group.users.length}</div>
      <ButtonSimple onClick={updateGroup}> Edit</ButtonSimple>
      <ButtonSimple onClick={deleteGroup}> del</ButtonSimple>
    </div>
  );
}
function GroupsList() {
  const { groups } = useSelector((state: AppState) => state.chat);
  return (
    <div className="channel-container groups-list">
      {groups.map((group: Group) => {
        return <SingleGroup key={group._id} group={group} />;
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
      <button type="button">
        <img title="Content" src={ButtonAdd} onClick={openGroupPopup} />
      </button>
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
