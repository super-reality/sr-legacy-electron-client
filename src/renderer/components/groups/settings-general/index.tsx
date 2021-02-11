import React, { useRef } from "react";
import { Group } from "../../../../types/chat";
import { updateGroup } from "../../../../utils/chat-utils/groups-services";
import ButtonSimple from "../../button-simple";

interface SettingsProps {
  activeGroup: Group;
}
export default function GeneralSettings(props: SettingsProps) {
  const { activeGroup } = props;
  const { _id } = activeGroup;
  const groupNameField = useRef<HTMLInputElement | null>(null);
  const groupAvatarField = useRef<HTMLInputElement | null>(null);

  const submitUpdateGroup = () => {
    if (groupNameField.current) {
      let groupProps;
      if (
        groupNameField.current &&
        groupAvatarField.current &&
        groupAvatarField.current.value
      ) {
        groupProps = {
          groupName: groupNameField.current.value,
          groupPhoto: groupAvatarField.current.value,
        };
      } else {
        groupProps = {
          groupName: groupNameField.current.value,
        };
      }
      updateGroup(_id, groupProps);
    }
  };

  return (
    <div className="general-group-settings">
      <div className="avatar-settings">
        {activeGroup.groupPhoto && (
          <img className="item-avatar" src={activeGroup.groupPhoto} alt="" />
        )}
        <div className="input-container">
          <div className="settings-label">Change Group Avatar</div>

          <input
            className="avatar-input"
            ref={groupAvatarField}
            key="group-avatar-input"
            type="text"
            placeholder=""
          />
        </div>
      </div>
      <div className="input-container">
        <div className="settings-label">Change Group Name</div>
        <input
          className="name-input"
          ref={groupNameField}
          key="group-name"
          type="text"
          placeholder=""
        />
      </div>

      <ButtonSimple
        margin="8px auto"
        width="140px"
        height="16px"
        onClick={submitUpdateGroup}
      >
        Update Group
      </ButtonSimple>
    </div>
  );
}
