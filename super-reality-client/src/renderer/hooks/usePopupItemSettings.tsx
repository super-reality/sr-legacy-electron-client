import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ButtonSimple from "../components/button-simple";
import usePopup from "./usePopup";

import IconFXInList from "../../assets/images/fx-in-popup-list-icon.png";
import IconFXThumbnail from "../../assets/images/fx-popup-icon.png";
import Flex from "../components/flex";
import { ReactComponent as CloseIcon } from "../../assets/svg/win-close.svg";
import { effectDB } from "../constants";
import { Item } from "../api/types/item/item";
import reduxAction from "../redux/reduxAction";
import updateItem from "../components/create-leson-detached/lesson-utils/updateItem";
import { AppState } from "../redux/stores/renderer";
import { EffectDB } from "../../types/utils";

// styles for the FX
import "./popup-fx-settings.scss";

interface SettingsItem {
  id: string;
  name: string;
  url: string;
}

interface SettingsItemProps {
  item: SettingsItem;
  callback: (id: string) => void;
}

function PopUpSettingsItem(props: SettingsItemProps): JSX.Element {
  const { item, callback } = props;
  const { id, name, url } = item;

  const [isHover, setIsHover] = useState("");

  const onHover = useCallback((e) => {
    e.preventDefault();
    setIsHover(e.target.id);
  }, []);

  const onHoverEnd = useCallback(() => {
    setIsHover("");
  }, []);

  return (
    <button
      style={{
        cursor: "pointer",
      }}
      key={name}
      id={id}
      type="button"
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
      onClick={() => {
        callback(id);
      }}
    >
      {isHover == id ? (
        <embed
          style={{
            pointerEvents: "none",
            borderRadius: "8px",
          }}
          src={url}
          width="150"
          height="150"
        />
      ) : (
        <img
          style={{
            pointerEvents: "none",
            borderRadius: "8px",
          }}
          width="150px"
          height="150px"
          src={IconFXInList}
        />
      )}
    </button>
  );
}

interface PopUpSettingsSerchProps {
  callback: (id: string) => void;
}

function PopUpSettingsSearch(props: PopUpSettingsSerchProps): JSX.Element {
  const { callback } = props;
  const [inputValue, setInputValue] = useState("");
  const [tagsState, setTagsState] = useState<string[]>([]);

  // get the array of items from the FX DB
  const currentFXArray = Object.keys(effectDB).map((key) => {
    return effectDB[key];
  });

  // initial state of the FX items to show
  const [fxItems, setFXItems] = useState<EffectDB[]>(currentFXArray);

  // get all tags arrays from the FX DB
  const currentTagsArray = currentFXArray.reduce(
    (prev, curr) => {
      return [...prev, ...curr.tags];
    },
    [...currentFXArray[0].tags]
  );

  // remove all doublicated tags
  const smallTagsArray = currentTagsArray.reduce(
    (prev, curr) => {
      const lc = curr.toLocaleLowerCase();
      if (prev.indexOf(lc) < 0) {
        return [...prev, lc];
      }
      return [...prev];
    },
    [currentTagsArray[0].toLocaleLowerCase()]
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { value } = event.currentTarget;

    if (value != "" && smallTagsArray.indexOf(value.toLocaleLowerCase()) >= 0) {
      setTagsState([...tagsState, value]);
      console.log("tag added", tagsState);
    }
    const string = value;

    setInputValue(string);
    console.log("tags", tagsState, inputValue);
  };

  const removeTag = (id: number) => {
    console.log("remove tag", id);
    const removeItem = [...tagsState.slice(0, id), ...tagsState.slice(id + 1)];
    setTagsState(removeItem);
  };

  useEffect(() => {
    if (tagsState.length != 0) {
      const newItems = currentFXArray.filter(({ tags }) => {
        return tags.some((e) =>
          tagsState.some((tag) => {
            // const newTag = tag.charAt(0).toUpperCase() + tag.slice(1);
            console.log(tag, tags.indexOf(tag));
            return tag == e;
          })
        );
      });
      console.log("newItems", newItems);
      setFXItems(newItems);
    } else {
      setFXItems(currentFXArray);
    }
    console.log("useEF", tagsState);
  }, [tagsState]);

  return (
    <div
      className="settings-popup-inner"
      style={{
        backgroundColor: "var(--color-section)",
      }}
    >
      <div className="popup-settings-input-container">
        <input
          autoFocus
          className="popup-settings-input-container-input"
          onChange={handleSearch}
          value={inputValue}
        />
      </div>

      <div
        className="settings-popup-tags-container"
        style={{
          display: "flex",
          height: "35px",
        }}
      >
        {tagsState.map((tag, indx) => {
          return (
            <ButtonSimple
              key={tag}
              style={{
                backgroundColor: "inherit",
                border: "var(--color-text) solid 1px",
                fontSize: "14px",
              }}
              onClick={() => {
                removeTag(indx);
              }}
            >
              {tag}
              <CloseIcon height="10px" width="10px" />
            </ButtonSimple>
          );
        })}
      </div>
      <Flex
        style={{
          overflow: "auto",
          height: "85%",
          flexWrap: "wrap",
        }}
      >
        {fxItems.map((key) => {
          return (
            <PopUpSettingsItem key={key.name} item={key} callback={callback} />
          );
        })}
      </Flex>
    </div>
  );
}

export default function usePopupItemSettings(): [JSX.Element, () => void] {
  const [Popup, doOpen, close] = usePopup(false);
  const [preview, setPreview] = useState("");

  const dispatch = useDispatch();

  const { treeItems, currentItem } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  // set the preview item
  const previewItem = (id: string): void => {
    setPreview(id);
  };

  const doUpdate = useCallback(
    <T extends Item>(data: Partial<T>) => {
      if (currentItem) {
        const updatedItem = { ...treeItems[currentItem], ...data };
        reduxAction(dispatch, {
          type: "CREATE_LESSON_V2_SETITEM",
          arg: { item: updatedItem },
        });
        updateItem(updatedItem, currentItem);
      }
    },
    [currentItem, treeItems]
  );

  const clickItem = useCallback(() => {
    console.log(preview);
    if (preview != "") {
      doUpdate({ effect: preview });
      setPreview("");
    }
    close();
  }, [close, preview]);

  const Element = (
    <Popup
      style={{
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#1f2124",
        top: "-8%",
        left: "10%",
        borderRadius: "15px",
      }}
      width="57%"
      height="72%"
    >
      <div className="settings-popup-inner">
        <div
          className="settings-popup-name"
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "var(--color-text-active)",
            margin: "0 5px 5px",
          }}
        >
          {preview != "" ? effectDB[preview].name : "FX Name"}
        </div>
        <div
          style={{
            cursor: "pointer",
          }}
          onClick={clickItem}
        >
          {preview != "" ? (
            <>
              <embed
                className="prveiw-fx"
                style={{
                  borderRadius: "8px",
                }}
                src={effectDB[preview].url}
                width="250px"
                height="250px"
              />
              <div className="item-tags">
                Tags: {effectDB[preview].tags.join(", ")}
              </div>
            </>
          ) : (
            <img
              className="prveiw-fx"
              width="250px"
              height="250px"
              src={IconFXThumbnail}
              alt="Fx Icon"
              style={{
                borderRadius: "8px",
              }}
            />
          )}
        </div>

        <div className="settings-popup-options">Options</div>
        <div className="settings-popup-exposed">Expoused Values</div>
      </div>
      <PopUpSettingsSearch callback={previewItem} />
    </Popup>
  );

  return [Element, doOpen];
}
