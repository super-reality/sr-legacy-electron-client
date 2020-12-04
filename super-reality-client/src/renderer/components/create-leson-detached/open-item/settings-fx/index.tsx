import React, { CSSProperties, useRef, useState } from "react";

import "./index.scss";

import { useDispatch } from "react-redux";

import { ReactComponent as IconAddFX } from "../../../../../assets/svg/new-fx-icon.svg";
import IconFXThumbnail from "../../../../../assets/images/fx-popup-icon.png";
import { ItemFX } from "../../../../api/types/item/item";

import usePopupItemSettings from "../../../../hooks/usePopupItemSettings";

interface SettingsFX {
  name: ItemFX;
}

interface FXSettingsProps {
  style?: CSSProperties;
  item?: any;
  update: (date: Partial<ItemFX>) => void;
}

export default function FXSettings(props: FXSettingsProps): JSX.Element {
  const { item, update, style } = props;
  const dispatch = useDispatch();

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
