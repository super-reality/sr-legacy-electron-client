import React from "react";
import IconFXThumbnail from "../../../../../assets/images/fx-popup-icon.png";
import usePopupItemSettings from "../../../../hooks/usePopupItemSettings";
import { ItemFX } from "../../../../api/types/item/item";
import "./index.scss";
import { getEffectById } from "../../../../constants";

interface FXSettingsProps {
  item?: ItemFX;
  update: (date: Partial<ItemFX>) => void;
}

export default function FXSettings(props: FXSettingsProps): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { item, update } = props;

  const [Popup, open] = usePopupItemSettings();

  const effect = getEffectById(item?.effect || "");

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
        {effect?.parameters.map((parameter) => {
          return (
            <div key={`parameter-${parameter.name}`}>{parameter.name}</div>
          );
        })}
      </div>
    </>
  );
}
