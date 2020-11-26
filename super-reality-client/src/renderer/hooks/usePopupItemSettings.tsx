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
          width="175px"
          height="163px"
        />
      ) : (
        <img
          style={{
            pointerEvents: "none",
            borderRadius: "8px",
          }}
          width="175px"
          height="163px"
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
  const [filters, setFilters] = useState<string[]>([]);

  // get the array of items from the FX DB
  const currentFXArray = Object.keys(effectDB).map((key) => {
    return effectDB[key];
  });
  const [fxItems, setFXItems] = useState<EffectDB[]>(currentFXArray);
  const [filteredItems, setFilteredItems] = useState<EffectDB[]>(
    currentFXArray
  );

  // const getValuesArray = (item: EffectDB) => {
  //   return Object.values(item).map((el) => {
  //     if (typeof el == "object") {
  //       return el.join();
  //     }
  //     return el;
  //   });
  // };
  const checkValues = (item: EffectDB, searchValue: string): boolean => {
    const allValues: string[] = Object.values(item).reduce((prev, curr) => {
      if (typeof curr == "object") {
        const lc = curr.map((el: string) => el.toLocaleLowerCase());
        return [...prev, ...lc];
      }
      const lc = curr.toLocaleLowerCase();
      return [...prev, lc];
    }, []);

    const testRegex = RegExp(searchValue, "g");
    console.log(
      "test check",
      allValues,
      allValues.some((el) => testRegex.test(el))
    );
    return allValues.some((el) => testRegex.test(el));
  };
  // console.log(
  //   "test values",
  //   Object.values(currentFXArray[0]).reduce((prev, curr) => {
  //     if (typeof curr == "object") {
  //       return [...prev, ...curr];
  //     }
  //     return [...prev, curr];
  //   }, [])
  // );
  // console.log("checkValues", checkValues(currentFXArray[0], "rainbow"));

  // initial state of the FX items to show

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
  const clearAllFilters = () => {
    setTagsState([]);
    setFilters([]);
    setFXItems(currentFXArray);
    setFilteredItems(currentFXArray);
  };
  console.log(fxItems);
  const handleSearch = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // e.preventDefault();
    console.log(e.key);
    if (e.key == "Enter" && inputValue != "") {
      const inputArr = inputValue.split(", ");
      console.log(inputArr);
      const currTagsState = tagsState;
      // let newFXArray = currentFXArray;
      inputArr.forEach((el) => {
        if (!tagsState.includes(el) && smallTagsArray.includes(el)) {
          console.log(el);
          console.log("tag added", tagsState);
          currTagsState.push(el);
        } else {
          const newFXArray = currentFXArray.filter((item) => {
            return checkValues(item, el);
          });
          console.log("newFXArray search", newFXArray);
          setFilteredItems([...newFXArray]);
          setFilters([...filters, el]);
        }
      });
      // setFXItems([...newFXArray]);
      setTagsState([...currTagsState]);
      console.log("TagsState", tagsState);
      setInputValue("");
    }
  };
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { value } = event.currentTarget;

    // if (
    //   value != "" &&
    //   smallTagsArray.indexOf(value.toLocaleLowerCase()) >= 0 &&
    //   !tagsState.includes(value)
    // ) {
    //   setTagsState([...tagsState, value]);
    //   console.log("tag added", tagsState);
    // }
    const string = value;

    setInputValue(string);
    console.log("tags", tagsState, inputValue);
  };

  const removeItem = (id: number, itemsArr: string[], switcher?: string) => {
    console.log("remove tag", id);
    const newItem = [...itemsArr.slice(0, id), ...itemsArr.slice(id + 1)];
    if (switcher == "tag") {
      setTagsState(newItem);
    } else if (switcher == "filter") {
      setFilters(newItem);
    }
  };

  useEffect(() => {
    if (tagsState.length != 0) {
      const newItems = filteredItems.filter(({ tags }) => {
        return tags.some((e) =>
          tagsState.some((tag) => {
            // const newTag = tag.charAt(0).toUpperCase() + tag.slice(1);

            return tag == e;
          })
        );
      });
      console.log("newItems", newItems);
      setFXItems(newItems);
    } else {
      setFXItems(filteredItems);
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
          onKeyDown={handleSearch}
          onChange={handleOnChange}
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
                borderRadius: "9px",
                margin: "5px 10px 5px 0px",
              }}
              onClick={() => {
                removeItem(indx, tagsState, "tag");
              }}
            >
              {tag}
              <CloseIcon
                style={{ marginLeft: "10px" }}
                height="10px"
                width="10px"
              />
            </ButtonSimple>
          );
        })}
      </div>
      <div
        className="settings-popup-tags-container"
        style={{
          display: "flex",
          height: "35px",
        }}
      >
        {filters.map((tag, indx) => {
          return (
            <ButtonSimple
              key={tag}
              style={{
                backgroundColor: "inherit",
                border: "var(--color-text) solid 1px",
                fontSize: "14px",
                borderRadius: "9px",
                margin: "5px 10px 5px 0px",
              }}
              onClick={() => {
                removeItem(indx, filters, "filter");
              }}
            >
              {tag}
              <CloseIcon
                style={{ marginLeft: "10px" }}
                height="10px"
                width="10px"
              />
            </ButtonSimple>
          );
        })}
      </div>
      <ButtonSimple onClick={clearAllFilters}> Remove filters</ButtonSimple>
      <Flex
        style={{
          overflow: "auto",
          height: "85%",
          flexWrap: "wrap",
          justifyContent: "space-between",
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
              />
              <div className="item-tags settings-popup-options">
                Tags: {effectDB[preview].tags.join(", ")}
              </div>
            </>
          ) : (
            <img
              className="prveiw-fx"
              src={IconFXThumbnail}
              alt="Fx Icon"
              style={{
                borderRadius: "8px",
              }}
            />
          )}
        </div>

        <div className="settings-popup-options">Options</div>
        <div className="settings-popup-exposed settings-popup-options">
          Expoused Values
        </div>
      </div>
      <PopUpSettingsSearch callback={previewItem} />
    </Popup>
  );

  return [Element, doOpen];
}
