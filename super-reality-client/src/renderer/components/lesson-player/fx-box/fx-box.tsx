/* eslint-disable react/prop-types */
import React, { CSSProperties, useCallback, useState } from "react";
import { useSelector } from "react-redux";

import { ItemFXTriggers } from "../../../api/types/item/item";
import { effectDB } from "../../../constants";
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
  effect?: string;
  callback?: (trigger: number) => void;
}

const FXBox = React.forwardRef<HTMLDivElement, FXBoxProps>(
  (props, forwardedRef) => {
    const { effect, style, pos, callback } = props;
    const [isModalBtn, setIsModalBtn] = useState("none");

    const showModalBtn = useCallback(() => {
      setIsModalBtn("block");
    }, []);
    const hideModalBtn = useCallback(() => {
      setIsModalBtn("none");
    }, []);
    // effectDB[0].url
    let srcFX = `${process.env.PUBLIC_URL}/fx/rainbow-circle-wavy-big/index.html`;
    if (effect) {
      switch (effect) {
        case "id_1":
          srcFX = `${process.env.PUBLIC_URL}/fx/rainbow-circle-wavy-big/index.html`;
          break;
        case "id_2":
          srcFX = `${process.env.PUBLIC_URL}/fx/rainbow-confetti/index.html`;
          break;
        case "id_3":
          srcFX = `${process.env.PUBLIC_URL}/fx/rainbow-orb-big/index.html`;
          break;
        case "id_4":
          srcFX = `${process.env.PUBLIC_URL}/fx/hyperspace1/index.html`;
          break;
        case "id_5":
          srcFX = `${process.env.PUBLIC_URL}/fx/hyperspace2/index.html`;
          break;
        case "id_6":
          srcFX = `${process.env.PUBLIC_URL}/fx/hyperspace3/index.html`;
          break;
        default:
          srcFX = `${process.env.PUBLIC_URL}/fx/rainbow-circle-wavy-big/index.html`;
      }
    }
    // console.log("effect", effect, "srcFX", srcFX);

    return (
      <>
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
          <iframe className="fx-iframe" src={srcFX} />
        </div>
      </>
    );
  }
);

FXBox.displayName = "FXBox";

export default FXBox;
