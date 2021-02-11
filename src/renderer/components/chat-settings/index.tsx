import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/stores/renderer";
import ButtonRound from "../button-round";
import GeneralSettingsGroup from "../groups/settings-general";
import GeneralSettingsChannel from "../channels/settings-general";
import { ReactComponent as Close } from "../../../assets/svg/close-circle-red.svg";
import "./index.scss";

interface GroupSettingsProps {
  close: () => void;
}
export default function ChatSettings(props: GroupSettingsProps) {
  const { close } = props;
  const {
    activeGroup,
    groups,
    activeChannel,
    channels,
    settingsType,
  } = useSelector((state: AppState) => state.chat);
  const activeGroupObject = groups.find(({ _id }) => _id === activeGroup);
  const activeChannelObject = channels.data.find(
    ({ _id }) => _id === activeChannel
  );
  return (
    <div className="group-settings">
      <div className="left-container">
        <div className="group-name">
          {settingsType === "group" &&
            activeGroupObject &&
            activeGroupObject.groupName}
          {settingsType === "channel" &&
            activeChannelObject &&
            activeChannelObject.channelName}
        </div>
        <div className="setttings-list">
          <div className="settings-list-item">General</div>
          <div className="settings-list-item">settings-list-item</div>
          <div className="settings-list-item">settings-list-item</div>
          <div className="settings-list-item">settings-list-item</div>
          <div className="settings-list-item">settings-list-item</div>
        </div>
      </div>

      <div className="settings-content-container">
        <div className="settings-content">
          {settingsType === "group" && activeGroupObject && (
            <GeneralSettingsGroup activeGroup={activeGroupObject} />
          )}
          {settingsType === "channel" && activeChannelObject && (
            <GeneralSettingsChannel activeChannel={activeChannelObject} />
          )}
        </div>
        <ButtonRound
          svg={Close}
          width="50px"
          height="50px"
          style={{
            color: "var(--color-text)",
          }}
          iconFill="var(--color-text)"
          onClick={() => {
            close();
          }}
        />
      </div>
    </div>
  );
}
