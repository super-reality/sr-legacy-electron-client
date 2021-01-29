import React, { useRef } from "react";
import { Channel } from "../../../../types/chat";
import { updateChannel } from "../../../../utils/chat-utils/services";
import ButtonSimple from "../../button-simple";

interface SettingsProps {
  activeChannel: Channel;
}
export default function ChannelGeneralSettings(props: SettingsProps) {
  const { activeChannel } = props;
  const { _id } = activeChannel;
  const channelNameField = useRef<HTMLInputElement | null>(null);
  const channelAvatarField = useRef<HTMLInputElement | null>(null);

  const submitUpdateChannel = () => {
    if (channelNameField.current) {
      if (
        channelNameField.current &&
        channelAvatarField.current &&
        channelAvatarField.current.value
      ) {
        updateChannel(_id, {
          channelName: channelNameField.current.value,
          channelPhoto: channelAvatarField.current.value,
        });
      } else {
        updateChannel(_id, { channelName: channelNameField.current.value });
      }
    }
  };

  return (
    <div className="general-channel-settings">
      {activeChannel.channelPhoto && (
        <img
          className="channel-avatar"
          src={activeChannel.channelPhoto}
          alt=""
        />
      )}
      <form className="update-channel-form">
        <fieldset>
          <div className="input-container">
            <label>Change Channel Name</label>
            <input
              ref={channelNameField}
              key="channel-name"
              type="text"
              placeholder=""
            />
          </div>
          <div className="input-container">
            <label>Change Channel Avatar</label>
            <input
              ref={channelAvatarField}
              key="channel-avatar-input"
              type="text"
              placeholder=""
            />
          </div>
        </fieldset>
        <ButtonSimple
          margin="8px auto"
          width="140px"
          height="16px"
          onClick={submitUpdateChannel}
        >
          Update Channel
        </ButtonSimple>
      </form>
    </div>
  );
}
