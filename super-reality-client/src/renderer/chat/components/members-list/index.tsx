import React from "react";
import { GroupUser } from "../../common/interfaces/GroupUser";
// import { PartyUser } from "../../common/interfaces/PartyUser";

interface MembersListProps {
  users: GroupUser[];
}
export default function MembersList(props: MembersListProps): JSX.Element {
  const { users } = props;
  return (
    <div
      style={{
        margin: "10px",
      }}
    >
      {users.map((groupUser: GroupUser) => {
        return (
          <div key={groupUser.id}>
            <div>{groupUser.user.name}</div>
          </div>
        );
      })}
    </div>
  );
}
