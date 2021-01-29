import React from "react";
import IconFXThumbnail from "../../../../assets/images/fx-popup-icon.png";
import usePopupItemSettings from "../../../hooks/usePopupItemSettings";
import { ItemFX } from "../../item";
import { BaseSettingsProps } from "../settings";
import "./index.scss";

export default function SettingsFX(
  props: BaseSettingsProps<ItemFX>
): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { item, update } = props;

  const [Popup, open] = usePopupItemSettings();

  return (
    <>
      {Popup}
      <div className="item-settings">
        <div
          className="input-name"
          style={{
            color: "var(--color--text)",
          }}
        >
          Style
        </div>
        <div className="settings-item-icon" onClick={open}>
          <img
            width="50px"
            height="50px"
            src={IconFXThumbnail}
            alt="icon-fx"
            className="settings-subitem-icon"
          />
        </div>
      </div>
    </>
  );
}
