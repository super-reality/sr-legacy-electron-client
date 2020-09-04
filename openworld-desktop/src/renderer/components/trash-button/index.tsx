import React, { CSSProperties, useCallback } from "react";
import "../buttons.scss";

import { ReactComponent as TrashIcon } from "../../../assets/svg/trash.svg";
import usePopupModal from "../../hooks/usePopupModal";
import deleteItem from "../../../utils/deleteItem";

interface TrashProps {
  style?: CSSProperties;
  type: string;
  id: string;
  callback?: () => void;
}

export default function TashButton(props: TrashProps): JSX.Element {
  const { style, callback, type, id } = props;

  const clickYes = useCallback(() => {
    deleteItem(type, id);
    if (callback) callback();
  }, []);

  const [Modal, open] = usePopupModal(
    `Are you sure?\nThis action can't be undone.`,
    clickYes
  );

  return (
    <div
      className="icon-button"
      style={{
        ...style,
        margin: "auto",
        display: "flex",
      }}
      onClick={(e) => {
        e.stopPropagation();
        open();
      }}
    >
      <Modal />
      <TrashIcon
        width="20px"
        height="20px"
        fill="var(--color-text)"
        style={{ margin: "auto" }}
      />
    </div>
  );
}
