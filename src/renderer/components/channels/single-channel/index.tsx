import React, { useState } from "react";
import { useDispatch } from "react-redux";
import reduxAction from "../../../redux/reduxAction";
import DefaultIcon from "../../../../assets/images/logo-icon.png";
import { ReactComponent as SettingsIcon } from "../../../../assets/svg/settings-gear2.svg";
import { Channel } from "../../../../types/chat";

interface SingleChannelProps {
  channel: Channel;
  openSettings: () => void;
}

export default function SingleChannel(props: SingleChannelProps): JSX.Element {
  const { channel, openSettings } = props;
  const [showButton, setShowButton] = useState<boolean>(false);
  const dispatch = useDispatch();
  console.log(showButton);
  // const { users } = channel;
  // const singleUser = users.filter((_id) => _id !== selfId);
  // const interlocutor = chatUsers.find(({ _id }) => _id === singleUser[0]);
  // console.log("singleUser", singleUser, "interlocutor", interlocutor);

  const setActiveChannel = (activeChannel: string) => {
    reduxAction(dispatch, {
      type: "SET_ACTIVE_CHANNEL",
      arg: activeChannel,
    });
  };
  const setSettingsType = () => {
    reduxAction(dispatch, {
      type: "SET_CHAT_SETTINGS_TYPE",
      arg: "channel",
    });
  };
  return (
    <div
      className="single-channel"
      onClick={() => {
        setActiveChannel(channel._id);
      }}
      onMouseEnter={() => {
        setShowButton(true);
      }}
      onMouseLeave={() => {
        setShowButton(false);
      }}
    >
      <img
        className="avatar"
        src={channel.channelPhoto ? channel.channelPhoto : DefaultIcon}
        alt=""
      />
      <div className="info">{channel.channelName}</div>
      {showButton && (
        <SettingsIcon
          onClick={() => {
            setSettingsType();
            openSettings();
          }}
          fill="#8a88c3"
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            position: "absolute",
            left: "80%",
          }}
        />
      )}
    </div>
  );
}
