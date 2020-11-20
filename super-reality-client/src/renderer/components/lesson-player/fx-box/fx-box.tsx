/* eslint-disable react/prop-types */
import React, { CSSProperties, useCallback, useState } from "react";
import { useSelector } from "react-redux";

import { ItemFXTriggers } from "../../../api/types/item/item";
import { effectDB, voidFunction } from "../../../constants";
import { AppState } from "../../../redux/stores/renderer";
import ButtonSimple from "../../button-simple";

import "./index.scss";

type ItemsState = Record<string, boolean>;
interface FXBoxProps {
  pos: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  style?: CSSProperties;
  effect?: string;
  triggersState?: ItemsState;
  callback?: (trigger: number) => void;
  id?: string;
}

const FXBox = React.forwardRef<HTMLDivElement, FXBoxProps>(
  (props, forwardedRef) => {
    const { effect, style, pos, callback, triggersState, id } = props;
    const { treeItems } = useSelector(
      (state: AppState) => state.createLessonV2
    );
    const triggers = { ...triggersState };
    // if (triggersState) {
    //   if (
    //     Object.keys(triggersState).filter((iid) => triggersState[iid] == false)
    //       .length == 1
    //   ) {
    //     const itemsId = Object.keys(triggersState).filter(
    //       (iid) => triggersState[iid] == true
    //     );
    //     const OK = Object.keys(triggersState);
    //     console.log(triggersState, itemsId, OK);
    //     if (itemsId[0] == id && callback) callback(ItemFXTriggers["On fx end"]);
    //   }
    // }

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
/*
<ButtonSimple
            className="click-on"
            onClick={
              callback
                ? () => callback(ItemFXTriggers["On fx end"])
                : voidFunction
            }
          >
            Hide
          </ButtonSimple>
  */
