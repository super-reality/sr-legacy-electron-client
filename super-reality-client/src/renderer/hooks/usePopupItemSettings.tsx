import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ButtonSimple from "../components/button-simple";
import usePopup from "./usePopup";

import IconFXInList from "../../assets/images/fx-in-popup-list-icon.png";
import IconFXThumbnail from "../../assets/images/fx-popup-icon.png";
import Flex from "../components/flex";
import { ReactComponent as CloseIcon } from "../../assets/svg/win-close.svg";
import { effectDB, getEffectById } from "../constants";
import { Item } from "../api/types/item/item";
import reduxAction from "../redux/reduxAction";
import updateItem from "../components/create-leson-detached/lesson-utils/updateItem";
import { AppState } from "../redux/stores/renderer";

// styles for the FX
import "./popup-fx-settings.scss";
import { EffectData } from "../../types/effects";

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
        width: "calc(25% - 10px)",
        height: "calc(25% - 10px)",
        minWidth: "100px",
        minHeight: "85px",
        padding: "0px",
        margin: "5px",
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
            width: "100%",
            height: "100%",
          }}
          src={url}
        />
      ) : (
        <img
          style={{
            pointerEvents: "none",
            borderRadius: "8px",
            width: "100%",
            height: "100%",
          }}
          src={IconFXInList}
        />
      )}
    </button>
  );
}

interface FXPopUpSettingsProps {
  previewItem: (id: string) => void;
  preview: string;
  clickOk: () => void;
  clickCancel: () => void;
  // inputComponent: JSX.Element;
}

function FXPopUpSettings(props: FXPopUpSettingsProps): JSX.Element {
  const { preview, previewItem, clickOk, clickCancel } = props;

  const [inputValue, setInputValue] = useState("");
  const [filters, setFilters] = useState<string[]>([]);

  const [fxItems, setFXItems] = useState(effectDB);

  const checkValues = (item: EffectData, searchValue: string): boolean => {
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

  const clearAllFilters = () => {
    setFilters([]);
    setFXItems(effectDB);
  };

  const filterItemsArray = (
    arrItems: EffectData[] | [],
    arrFilters: string[]
  ) => {
    if (arrFilters.length != 0) {
      // filter the items
      const newFXArray = arrItems.filter((item) => {
        return arrFilters.some((el) => checkValues(item, el));
      });
      console.log(newFXArray);
      setFXItems([...newFXArray]);
    } else {
      setFXItems(effectDB);
    }
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { value } = event.currentTarget;
    setInputValue(value);
    console.log("inputValue", inputValue);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // check if the Enter pressed
    if (e.key == "Enter" && inputValue != "") {
      // split the input string
      const inputArr = inputValue.split(", ");
      console.log(inputArr);
      const currFilterState = filters;

      inputArr.forEach((el) => {
        if (!filters.includes(el)) {
          console.log(el);
          console.log("filter added", filters);
          currFilterState.push(el);
        }
      });
      // set new filters state
      setFilters([...currFilterState]);
      console.log("filters", currFilterState);
      filterItemsArray(fxItems, currFilterState);

      setInputValue("");
    }
  };

  const addTag = (tag: string) => {
    const newFilters = [tag];
    setFilters([...newFilters]);
    console.log(newFilters);
    filterItemsArray(effectDB, newFilters);
  };

  const removeItem = (id: number, itemsArr: string[]) => {
    console.log("remove tag", id);
    const currFilterState = [
      ...itemsArr.slice(0, id),
      ...itemsArr.slice(id + 1),
    ];

    setFilters(currFilterState);

    filterItemsArray(fxItems, currFilterState);
  };

  const previewEffect = getEffectById(preview);

  return (
    <>
      <div style={{ marginRight: "0px" }} className="settings-popup-inner">
        <div
          style={{
            height: "85%",
          }}
        >
          <div
            className="settings-popup-name"
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "var(--color-text-active)",
              margin: "0 5px 5px",
            }}
          >
            {preview != "" ? previewEffect?.name || "not found" : "FX Name"}
          </div>
          <div
            style={{
              cursor: "pointer",
            }}
          >
            {preview != "" ? (
              <>
                <embed
                  className="prveiw-fx"
                  style={{
                    borderRadius: "8px",
                  }}
                  src={previewEffect?.url || ""}
                />
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
          <div className="item-tags settings-popup-options">
            Tags:{" "}
            {preview != "" &&
              previewEffect?.tags.map((tag) => {
                return (
                  <span
                    key={tag}
                    style={{
                      cursor: "pointer",
                      marginLeft: "5px",
                      border: "var(--color-text) solid 1px",
                      borderRadius: "3px",
                      padding: "0 3px",
                    }}
                    onClick={() => {
                      addTag(tag);
                    }}
                  >
                    {tag}
                  </span>
                );
              })}
          </div>
          <div className="settings-popup-options">Options</div>
          <div className="settings-popup-exposed settings-popup-options">
            Expoused Values
          </div>
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            marginTop: "10%",
          }}
        >
          <ButtonSimple
            style={{
              margin: "auto 5px auto auto",
            }}
            width="-webkit-fill-available"
            height="35px"
            onClick={clickOk}
          >
            Ok
          </ButtonSimple>
          <ButtonSimple
            style={{
              margin: "auto auto auto 5px",
              // width: "-webkit-fill-available",
            }}
            width="-webkit-fill-available"
            height="35px"
            onClick={clickCancel}
          >
            Cancel
          </ButtonSimple>
        </div>
      </div>
      <div
        className="settings-popup-inner"
        style={{
          backgroundColor: "var(--color-section)",
        }}
      >
        <SettingsInput
          handleSearch={handleSearch}
          handleOnChange={handleOnChange}
          inputValue={inputValue}
        />
        <div
          className="settings-popup-tags-container"
          style={{
            display: "flex",
            height: "35px",
          }}
        >
          <ButtonSimple
            style={{
              border: "var(--color-text) solid 1px",
              fontSize: "14px",
              borderRadius: "9px",
              margin: "5px 10px 5px 5px",
            }}
            onClick={clearAllFilters}
          >
            Remove filters
          </ButtonSimple>
          {filters.map((filter, indx) => {
            return (
              <ButtonSimple
                key={filter}
                style={{
                  backgroundColor: "inherit",
                  border: "var(--color-text) solid 1px",
                  fontSize: "14px",
                  borderRadius: "9px",
                  margin: "5px 10px 5px 0px",
                }}
                onClick={() => {
                  removeItem(indx, filters);
                }}
              >
                {filter}
                <CloseIcon
                  style={{ marginLeft: "10px" }}
                  height="10px"
                  width="10px"
                />
              </ButtonSimple>
            );
          })}
        </div>

        <Flex
          style={{
            overflow: "auto",
            maxHeight: "85%",
            flexWrap: "wrap",
          }}
        >
          {fxItems.map((key) => {
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
    </>
  );
}

interface SettingsInputProps {
  handleSearch: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputValue: string;
}
function SettingsInput(props: SettingsInputProps): JSX.Element {
  const { handleSearch, handleOnChange, inputValue } = props;
  return (
    <div className="popup-settings-input-container">
      <input
        style={{
          borderRadius: "8px",
        }}
        autoFocus
        className="popup-settings-input-container-input"
        onKeyDown={handleSearch}
        onChange={handleOnChange}
        value={inputValue}
      />
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
      if (currentItem && data) {
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

  const clickOk = useCallback(() => {
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
      <FXPopUpSettings
        previewItem={previewItem}
        clickOk={clickOk}
        preview={preview}
        clickCancel={close}
      />
    </Popup>
  );

  return [Element, doOpen];
}
