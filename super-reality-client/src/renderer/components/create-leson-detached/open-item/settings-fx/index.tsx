import React, { CSSProperties } from "react";
import IconFXThumbnail from "../../../../../assets/images/fx-popup-icon.png";
import usePopupItemSettings from "../../../../hooks/usePopupItemSettings";
import { ItemFX } from "../../../../items/item";
import "./index.scss";

interface FXSettingsProps {
  style?: CSSProperties;
  item?: any;
  update: (date: Partial<ItemFX>) => void;
}

export default function FXSettings(): JSX.Element {
  // const { item, update, style } = props;

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
