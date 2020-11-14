/* eslint-disable react/prop-types */
import React, { CSSProperties, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import path from "path";
import proc from "process";
import { FX, ItemFXTriggers } from "../../../api/types/item/item";
import { voidFunction } from "../../../constants";
import { AppState } from "../../../redux/stores/renderer";

import "./index.scss";

interface FXBoxProps {
  pos: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  style?: CSSProperties;
  effect?: FX;
  callback?: (trigger: number) => void;
}

const FXBox = React.forwardRef<HTMLDivElement, FXBoxProps>(
  (props, forwardedRef) => {
    const { effect, style, pos, callback } = props;
    // const [srcFX, setSrcFX] = useState("../fx-wavy/");
    // eslint-disable-next-line global-require
    const { remote } = require("electron");
    const publicPath = remote.app.isPackaged
      ? path.join(proc.resourcesPath)
      : path.join(remote.app.getAppPath(), "public");

    let srcFX = `${process.env.PUBLIC_URL}/fx/rainbow-circle-wavy-big/`;
    if (effect) {
      switch (effect) {
        case "id_1":
          srcFX = `${process.env.PUBLIC_URL}/fx/rainbow-circle-wavy-big/`;
          break;
        case "id_2":
          srcFX = `${process.env.PUBLIC_URL}/fx/rainbow-confetti/`;
          break;
        case "id_3":
          srcFX = `${process.env.PUBLIC_URL}/fx/rainbow-orb-big/`;
          break;
        case "id_4":
          srcFX = `${process.env.PUBLIC_URL}/fx/hyperspace1/`;
          break;
        case "id_5":
          srcFX = `${process.env.PUBLIC_URL}/fx/hyperspace2/`;
          break;
        case "id_6":
          srcFX = `${process.env.PUBLIC_URL}/fx/hyperspace3/`;
          break;
        default:
          srcFX = `${process.env.PUBLIC_URL}/fx/rainbow-circle-wavy-big/`;
      }
    }
    console.log("effect", effect, "srcFX", srcFX);
    // useEffect(() => {
    //   if (effect == "id_1") {
    //     setSrcFX("../fx/rainbow-circle-wavy-big/");
    //   }
    //   if (effect == "id_2") {
    //     setSrcFX("../fx/rainbow-confetti");
    //   }
    //   if (effect == "id_3") {
    //     setSrcFX("../fx/fx-test/");
    //   }
    // }, [effect]);

    return (
      <div
        ref={forwardedRef}
        className="fx-box"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: `${pos.width}px`,
          height: `${pos.height}px`,
          ...style,
        }}
      >
        {/* <div>FX</div> */}
        <iframe className="fx-iframe" src={srcFX} />
      </div>
    );
  }
);

FXBox.displayName = "FXBox";

export default FXBox;
/*
style={{
            width: "274%",
            top: "-20%",
            left: "-87%",
            height: "calc(100% * 1.7)",
          }}
*/
