import React from "react";
import usePopup from "./usePopup";

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
        <ul>
          <li>
            <button
              type="button"
              style={{
                cursor: "pointer",
                color: "var(--color-text)",
              }}
              onClick={deleteMessage}
            >
              del
            </button>
          </li>
          <li>
            <button
              type="button"
              style={{
                cursor: "pointer",
                color: "var(--color-text)",
              }}
              onClick={editMessage}
            >
              edit
            </button>
          </li>
        </ul>
      </MessagePopup>
    );
  };

  return [Modal, doOpen];
}
