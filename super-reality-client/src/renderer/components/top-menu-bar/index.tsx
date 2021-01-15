import React, { useCallback, useState } from "react";
import useTopNavDropdown, { EditorMenues } from "../../hooks/useTopnavDropdown";
import useOutsideClick from "../../hooks/useOutsideClick";
import "./index.scss";
import setAppMode from "../../redux/utils/setAppMode";
import { MODE_RECORDER } from "../../redux/slices/renderSlice";

const menues: EditorMenues[] = [
  "Create",
  "Library",
  "Resources",
  "Help",
  "Open Source",
];

export default function TopMenuBar() {
  const [open, setOpen] = useState<EditorMenues | null>(null);

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

  return (
    <>
      <div className="top-menu-container">
        <div className="top-menu-logo" />
        {menues.map((str) => (
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
