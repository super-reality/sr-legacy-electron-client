import React from "react";
import { ReactComponent as IconAddFX } from "../../../../../assets/svg/new-fx-icon.svg";
import IconFXThumbnail from "../../../../../assets/images/fx-popup-icon.png";

import usePopupItemSettings from "../../../../hooks/usePopupItemSettings";
import "./settings-fx.scss";

export default function FXSettings(): JSX.Element {
  const [Popup, open] = usePopupItemSettings();

  return (
    <>
      {Popup}

      <div className="settings-item-lable ">
        <IconAddFX
          width="16px"
          height="16px"
          style={{
            margin: "3px 5px 3px 0",
          }}
        />
        <div className="item-lable-name">FX</div>
      </div>
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
