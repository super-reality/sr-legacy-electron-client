import React, { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import ReactCSSTransitionGroup from 'react-transition-group';
import { setConstantValue } from "typescript";
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

interface SettingsItem {
  id: string;
  name: string;
  url: string;
}
interface EffectDB {
  id: string;
  name: string;
  url: string;
  tags: string[];
}

interface SettingsItemProps {
  item: SettingsItem;
  callback: (id: string) => void;
}

function PopUpSettingsItem(props: SettingsItemProps): JSX.Element {
  const { item, callback } = props;
  const { id, name, url } = item;

  const [isHover, setIsHover] = useState("");
  const effectOneRef = useRef<HTMLDivElement>(null);

  const onHover = useCallback((e) => {
    e.preventDefault();
    setIsHover(e.target.id);
  }, []);

  const onHoverEnd = useCallback(() => {
    setIsHover("");
  }, []);

  const preveiwItem = useCallback(() => {
    callback(id);
  }, []);

  return (
    <button
      style={{
        cursor: "pointer",
      }}
      key={name}
      id={id}
      type="button"
      // ref={effectOneRef}
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
            transition: "all 500ms ease-in-out",
          }}
          src={url}
          width="200"
          height="200"
        />
      ) : (
        <img
          style={{
            cursor: "pointer",
            pointerEvents: "none",
            transition: "all 500ms ease-in-out",
          }}
          width="200px"
          height="200px"
          src={IconFXInList}
        />
      )}
    </button>
  );
}

export default function usePopupItemSettings(): [JSX.Element, () => void] {
  const [Popup, doOpen, close] = usePopup(false);
  const [value, setValue] = useState("");
  const [preview, setPreview] = useState("");
  const [fxItems, setFXItems] = useState<EffectDB[]>();
  const [tags, setTags] = useState<string[]>([]);

  const searchRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  const { treeItems, currentItem } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  // filter the FX

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let tagsArray: Array<string> = [];
      let currentEffects: EffectDB[] = [];
      let newEffects: EffectDB[] = [];
      // if value not "" filter the items
      if (event.currentTarget.value != "") {
        // current FX list
        Object.keys(effectDB).forEach((key) => {
          effectDB[key].tags.forEach((tag) => {
            if (!tagsArray.includes(tag)) {
              tagsArray.push(tag);
            }
          });
        });

        const filteredTags = tagsArray.filter(
          (tagItem) => tagItem == event.currentTarget.value
        );
        tagsArray = filteredTags;
        currentEffects = Object.keys(effectDB).map((key) => {
          return effectDB[key];
        });
        newEffects = currentEffects.filter((item) => {
          // filter the FX
          return item.tags.some((e) => filteredTags.some((el) => el == e));
        });
      } else {
        newEffects = Object.keys(effectDB).map((key) => {
          return effectDB[key];
        });
      }
      setTags(tagsArray);
      setFXItems([...newEffects]);
      console.log(newEffects);
      const string = event.currentTarget.value;
      setValue(string);
    },
    []
  );

  // const filterTags = useCallback(
  //   (tag) => {

  //   },
  //   [tagsArray]
  // );

  const previewItem = useCallback((id) => {
    console.log(id);
    setPreview(id);
  }, []);
  // const toggleFullScreen = useCallback((event) => {
  //   event.preventDefault();
  //   update({ fullScreen: !item.fullScreen });
  // }, []);
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
        top: "0px",
        borderRadius: "15px",
      }}
      width="100%"
      height="100%"
    >
      <div
        className="settings-popup-inner"
        style={{
          backgroundColor: "var(--color-section)",
          color: "var(--color-text-active)",
        }}
      >
        <div
          className="settings-popup-name"
          style={{
            fontSize: "18px",
            fontWeight: "bold",
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
                style={{
                  pointerEvents: "none",
                  transition: "all 500ms ease-in-out",
                }}
                src={effectDB[preview].url}
                width="360px"
                height="340px"
              />
              <div className="item-tags">
                Tags: {effectDB[preview].tags.join(", ")}
              </div>
            </>
          ) : (
            <img
              width="360px"
              height="340px"
              src={IconFXThumbnail}
              alt="Fx Icon"
            />
          )}
        </div>

        <div className="settings-popup-options">Options</div>
        <div className="settings-popup-exposed">Expoused Values</div>
      </div>
      <div
        className="settings-popup-inner"
        style={{
          backgroundColor: "var(--color-section)",
        }}
      >
        <Flex>
          <div className="popup-settings-input-container">
            <input
              autoFocus
              className="popup-settings-input-container-input"
              onChange={handleSearch}
              value={value}
            />
          </div>
        </Flex>
        <div
          className="settings-popup-tags-container"
          style={{
            display: "flex",
          }}
        >
          {tags.map((tag) => {
            return (
              <ButtonSimple
                key={tag}
                style={{
                  backgroundColor: "inherit",
                  border: "var(--color-text) solid 1px",
                }}
                onClick={() => {}}
              >
                {tag}
                <CloseIcon height="10px" width="10px" />
              </ButtonSimple>
            );
          })}
        </div>
        <Flex
          style={{
            overflow: "auto scroll",
            height: "90%",
            flexWrap: "wrap",
          }}
        >
          {Object.keys(effectDB).map((key) => {
            // console.log(effectDB[key]);
            return (
              <PopUpSettingsItem
                key={key}
                item={effectDB[key]}
                callback={previewItem}
              />
            );
          })}
        </Flex>
      </div>
    </Popup>
  );

  return [Element, doOpen];
}
