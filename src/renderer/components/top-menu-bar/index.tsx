import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import useTopNavDropdown, { EditorMenues } from "../../hooks/useTopnavDropdown";
import useOutsideClick from "../../hooks/useOutsideClick";
import "./index.scss";

const menues: EditorMenues[] = [
  "Create",
  "Library",
  "Resources",
  "Help",
  "Open Source",
];

export default function TopMenuBar() {
  const [open, setOpen] = useState<EditorMenues | null>(null);

  const history = useHistory();

  const onSelect = useCallback(
    (selected: string) => {
      setOpen(null);
      if (open == "Create") {
        if (selected == "Recording") {
          history.push("/recorder");
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
