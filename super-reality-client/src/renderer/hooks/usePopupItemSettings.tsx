import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
// import ReactCSSTransitionGroup from 'react-transition-group';
import { setConstantValue } from "typescript";
import { filter, values } from "lodash";
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
          }}
          src={url}
          width="150"
          height="150"
        />
      ) : (
        <img
          style={{
            cursor: "pointer",
            pointerEvents: "none",
          }}
          width="150px"
          height="150px"
          src={IconFXInList}
        />
      )}
    </button>
  );
}

export default function usePopupItemSettings(): [JSX.Element, () => void] {
  const [Popup, doOpen, close] = usePopup(false);
  const [inputValue, setInputValue] = useState("");
  const [preview, setPreview] = useState("");

  const searchRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  const { treeItems, currentItem } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  // get the Tags array from the FX DB
  // tagsArray.some(
  //   (el) => el == event.currentTarget.value
  // )

  const currentFXArray = Object.keys(effectDB).map((key) => {
    return effectDB[key];
  });
  const [fxItems, setFXItems] = useState<EffectDB[]>(currentFXArray);
  //
  const lowCaseStartTags = currentFXArray[0].tags.map((tag) => {
    return tag.toLocaleLowerCase();
  });
  const currentTagsArray = currentFXArray.reduce(
    (prev, curr) => {
      return [...prev, ...curr.tags];
    },
    [...lowCaseStartTags]
  );

  const smallTags = currentTagsArray.reduce(
    (prev, curr) => {
      const lc = curr.toLocaleLowerCase();
      if (prev.indexOf(lc) < 0) {
        return [...prev, lc];
      }
      return [...prev];
    },
    [currentTagsArray[0].toLocaleLowerCase()]
  );
  console.log("tagsArray", currentTagsArray);
  console.log(smallTags);
  const [tagsState, setTagsState] = useState<string[]>([]);
  // if (value != "") {}
  // const currentTag:string[] = effectDB[key].tags.filter((tag) => {
  //   const tagLC = tag.toLocaleLowerCase();
  //   if (!tagsArray.includes(tagLC)) {
  //     tagsArray.push(tagLC);
  //     return tagLC;
  //   }
  //   return currentTag;
  // });
  // const onEnter = useCallback((event) => {
  //   const val = event.target.value;
  //   if (event.key === "Enter" && val) {
  //     setTags([...tags, val]);
  //     setInputValue("");
  //   }
  // }, []);

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let tag: string;
      const { value } = event.currentTarget;
      const currentTags = tagsState;
      if (value != "" && smallTags.indexOf(value.toLocaleLowerCase()) >= 0) {
        console.log(value, smallTags.indexOf(value));

        console.log("tags1", tagsState, inputValue, currentTags);
        setTagsState([...tagsState, value]);
        console.log("tag added", tagsState);
      }
      const string = value;

      setInputValue(string);
      console.log("tags", tagsState, inputValue);
    },
    []
  );

  const removeTag = useCallback((id) => {
    const removeItem = [...tagsState.slice(0, id), ...tagsState.slice(id + 1)];
    setTagsState(removeItem);
  }, []);
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

  const previewItem = useCallback((id) => {
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
        top: "-100px",
        left: "150px",
        borderRadius: "15px",
      }}
      width="700px"
      height="500px"
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
                }}
                src={effectDB[preview].url}
                width="200px"
                height="200px"
              />
              <div className="item-tags">
                Tags: {effectDB[preview].tags.join(", ")}
              </div>
            </>
          ) : (
            <img
              width="200px"
              height="200px"
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
              ref={searchRef}
              className="popup-settings-input-container-input"
              onChange={handleSearch}
              value={inputValue}
            />
          </div>
        </Flex>
        <div
          className="settings-popup-tags-container"
          style={{
            display: "flex",
          }}
        >
          {tagsState.map((tag, indx) => {
            return (
              <ButtonSimple
                key={tag}
                style={{
                  backgroundColor: "inherit",
                  border: "var(--color-text) solid 1px",
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
            overflow: "auto scroll",
            height: "90%",
            flexWrap: "wrap",
          }}
        >
          {fxItems.map((key) => {
            // console.log(effectDB[key]);
            return (
              <PopUpSettingsItem
                key={key.name}
                item={key}
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
/*
Object.keys(effectDB)
*/
