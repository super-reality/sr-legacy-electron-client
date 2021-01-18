import React from "react";
import usePopup from "./usePopup";

import IconEdit from "../../assets/images/popup-edit.png";
import IconDelete from "../../assets/images/popup-delete.png";

interface MessageMenuProps {
  removeMessage: () => void;
  startEditMessage: () => void;
}

export default function usePopupMessageMenu(
  props: MessageMenuProps
): [() => JSX.Element, () => void] {
  const { removeMessage, startEditMessage } = props;
  const [MessagePopup, doOpen, close] = usePopup(false);

  const deleteMessage = () => {
    removeMessage();
    close();
  };

  const editMessage = () => {
    startEditMessage();
    close();
  };
  const Modal = () => {
    return (
      <MessagePopup width="100px" height="50px">
        <div className="popup-item">
          <button
            type="button"
            style={{
              cursor: "pointer",
              color: "var(--color-text)",
            }}
            onClick={editMessage}
          >
            Edit Message
            <img src={IconEdit} alt="" />
          </button>
        </div>
        <div className="popup-item">
          <button
            type="button"
            style={{
              cursor: "pointer",
              color: "var(--color-text)",
            }}
            onClick={deleteMessage}
          >
            Delete Message
            <img src={IconDelete} alt="" />
          </button>
        </div>
      </MessagePopup>
    );
  };

  return [Modal, doOpen];
}
