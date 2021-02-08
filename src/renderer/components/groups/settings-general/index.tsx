import React, { useRef } from "react";
import { Group } from "../../../../types/chat";
import { updateGroup } from "../../../../utils/chat-utils/services";
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
          groupName: "Test",
        };
      }
      updateGroup(_id, groupProps);
    }
  };

  return (
    <div className="general-group-settings">
      {activeGroup.groupPhoto && (
        <img className="group-avatar" src={activeGroup.groupPhoto} alt="" />
      )}
      <form className="update-group-form">
        <fieldset>
          <div className="input-container">
            <label>Change Group Name</label>
            <input
              ref={groupNameField}
              key="group-name"
              type="text"
              placeholder=""
            />
          </div>
          <div className="input-container">
            <label>Change Group Avatar</label>
            <input
              ref={groupAvatarField}
              key="group-avatar-input"
              type="text"
              placeholder=""
            />
          </div>
        </fieldset>
        <ButtonSimple
          margin="8px auto"
          width="140px"
          height="16px"
          onClick={submitUpdateGroup}
        >
          Update Group
        </ButtonSimple>
      </form>
    </div>
  );
}
