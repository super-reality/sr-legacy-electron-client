import { CSSProperties, useRef } from "react";
import ButtonSimple from "../components/button-simple";
import usePopup from "./usePopup";
import "./chat-popup.scss";

interface CreateItemProps {
  createItem: (itemName: string, itemPhoto?: string) => void;
}
interface ChatItemModalProps {
  style?: CSSProperties;
  width: string;
  height: string;
  itemType: string;
}
export default function usePopupCreateChatItem(
  props: CreateItemProps
): [(p: ChatItemModalProps) => JSX.Element, () => void] {
  const { createItem } = props;
  const [CreateChatItemPopup, doOpen, close] = usePopup(false);
  const itemNameField = useRef<HTMLInputElement | null>(null);
  const itemAvatarField = useRef<HTMLInputElement | null>(null);

  const submitCreateItem = () => {
    if (itemNameField.current) {
      if (itemAvatarField.current && itemAvatarField.current.value) {
        createItem(itemNameField.current.value, itemAvatarField.current.value);
        close();
      } else {
        createItem(itemNameField.current.value);
        close();
      }
    }
  };

  const Modal = (modalProps: ChatItemModalProps) => {
    const { style, width, height, itemType } = modalProps;
    return (
      <CreateChatItemPopup width={width} height={height} style={style}>
        <form className="create-container">
          <fieldset className="create-chat-item">
            <div className="input-container">
              <label>{`${itemType} Name`}</label>
              <input
                ref={itemNameField}
                key="item-name"
                type="text"
                placeholder=""
              />
            </div>
            <div className="input-container">
              <label>{`${itemType} Avatar`}</label>
              <input
                ref={itemAvatarField}
                key="item-avatar-input"
                type="text"
                placeholder=""
              />
            </div>
          </fieldset>
          <div className="buttons-container">
            <ButtonSimple
              margin="8px auto"
              width="70px"
              height="16px"
              onClick={submitCreateItem}
            >
              Ok
            </ButtonSimple>
            <ButtonSimple
              margin="8px auto"
              width="70px"
              height="16px"
              onClick={() => {
                close();
              }}
            >
              Cancel
            </ButtonSimple>
          </div>
        </form>
      </CreateChatItemPopup>
    );
  };

  return [Modal, doOpen];
}
