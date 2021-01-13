import React from "react";
import usePopup from "./usePopup";

interface MessageMenuProps {
  removeMessage: () => void;
  startEditMessage: () => void;
  yPosition: number | string | undefined;
  xPosition: number | string | undefined;
}

export default function usePopupMessageMenu(
  props: MessageMenuProps
): [() => JSX.Element, () => void] {
  const { removeMessage, startEditMessage, yPosition, xPosition } = props;
  const [MessagePopup, doOpen, close] = usePopup(false);

  console.log(xPosition, yPosition);

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
