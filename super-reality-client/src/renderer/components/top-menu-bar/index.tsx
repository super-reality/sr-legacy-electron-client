import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import useTopNavDropdown, { EditorMenues } from "../../hooks/useTopnavDropdown";
import useOutsideClick from "../../hooks/useOutsideClick";
import "./index.scss";
import setAppMode from "../../redux/utils/setAppMode";
import { AppState } from "../../redux/stores/renderer";
import { MODE_RECORDER, MODE_TRELLO } from "../../redux/slices/renderSlice";

const menues: EditorMenues[] = [
  "Create",
  "Library",
  "Resources",
  "Help",
  "Open Source",
];

const menuesForTrello: EditorMenues[] = [
 
];


export default function TopMenuBar() {
  const [open, setOpen] = useState<EditorMenues | null>(null);
  const { appMode } = useSelector((state: AppState) => state.render);

  const onSelect = useCallback(
    (selected: string) => {
      setOpen(null);
      if (open == "Create") {
        if (selected == "Recording") {
          setAppMode(MODE_RECORDER);
        }
      }
    },
    [open]
  );

  const [Dropdown, dropdownRef] = useTopNavDropdown(open, onSelect);

  useOutsideClick(dropdownRef, () => setOpen(null));
  
  let curMenues =  menues; 

  if(appMode === MODE_TRELLO){
    curMenues = menuesForTrello
  }
  


  return (
    <>
      <div className="top-menu-container">
        <div className="top-menu-logo" />
        {curMenues.map((str) => (
          <div style={{ position: "relative" }} key={`top-bar-menu-${str}`}>
            <div
              className={`top-menu-item ${str == open ? "active" : ""}`}
              onClick={() => {
                if (!open) setOpen(str);
                else if (str == open) setOpen(null);
              }}
              onMouseEnter={() => {
                if (open) setOpen(str);
              }}
            >
              {str}
            </div>
            {open == str && <Dropdown />}
          </div>
        ))}
      </div>
    </>
  );
}
