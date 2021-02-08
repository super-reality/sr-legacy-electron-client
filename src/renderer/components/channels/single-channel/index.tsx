import React, { useState } from "react";
import { useDispatch } from "react-redux";
import reduxAction from "../../../redux/reduxAction";
import DefaultUser from "../../../../assets/images/default-chat-icon.png";
import { Channel } from "../../../../types/chat";

interface SingleChannelProps {
  channel: Channel;
}

export default function SingleChannel(props: SingleChannelProps): JSX.Element {
  const { channel } = props;
  const [showButton, setShowButton] = useState<boolean>(false);
  const dispatch = useDispatch();

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
        src={channel.channelPhoto ? channel.channelPhoto : DefaultUser}
        alt=""
      />
      <div className="info">{channel.channelName}</div>
      {showButton && (
        <div
          style={{
            backgroundColor: "var(--color-button-hover)",
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
