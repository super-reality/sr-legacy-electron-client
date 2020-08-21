import React, { useCallback } from "react";
import "./index.scss";
import { ReactComponent as CloseIcon } from "../../../assets/svg/close.svg";

interface TagProps {
  name: string;
  close?: boolean;
  onCloseCallback?: () => void;
  onClickCallback?: (name?: string) => void;
}

export default function Tag(props: TagProps): JSX.Element {
  const { name, close, onCloseCallback, onClickCallback } = props;

  const onClick = useCallback(() => {
    if (onClickCallback) onClickCallback(name);
  }, []);

  return (
    <div onClick={onClick} className="tag">
      <div className="name">{name}</div>
      {close ? (
        <div onClick={onCloseCallback} className="close">
          <CloseIcon
            style={{
              width: "10px",
              height: "10px",
              margin: "auto auto auto 0",
            }}
            stroke="var(--color-icon)"
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
