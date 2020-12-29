import React from "react";
import "./index.scss";

interface MembersListProps {
  users: string[];
}

export default function MembersList(props: MembersListProps): JSX.Element {
  const { users } = props;
  // const htmlDocument: Document= document;
  return (
    <div className="members-list">
      <div
        className="members"
        style={{
          height: `${
            (document as any).querySelector(".window-content-container")
              .clientHeight - 40
          }px`,
        }}
      >
        {users.map((groupUser: any) => {
          return (
            <div key={groupUser._id} className="member">
              <img
                src={groupUser.avatar}
                alt={groupUser.email}
                className="avatar"
              />
              <div>{groupUser.email}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
/*
<div>
          <div className="member">Test</div>
          <div className="member">Test</div>
          <div className="member">Test</div>
          <div className="member">Test</div>
          <div className="member">Test</div>
        </div>
*/
