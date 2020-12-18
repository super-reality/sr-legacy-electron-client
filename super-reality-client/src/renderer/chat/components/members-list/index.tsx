import React from "react";
import "./index.scss";
import { GroupUser } from "../../common/interfaces/GroupUser";
// import { PartyUser } from "../../common/interfaces/PartyUser";

interface MembersListProps {
  users: GroupUser[];
}
export default function MembersList(props: MembersListProps): JSX.Element {
  const { users } = props;
  return (
    <div className="members-list">
      <div className="members">
        {users.map((groupUser: GroupUser) => {
          return (
            <div key={groupUser.id}>
              <div className="member">{groupUser.user.name}</div>
            </div>
          );
        })}
        <div>
          <div className="member">Test</div>
          <div className="member">Test</div>
          <div className="member">Test</div>
          <div className="member">Test</div>
          <div className="member">Test</div>
        </div>
      </div>
    </div>
  );
}
