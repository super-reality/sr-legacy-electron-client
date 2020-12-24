import React, { useCallback, useState } from "react";
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

  const onSelect = useCallback((selected: string) => {
    setOpen(null);
    console.log(selected);
  }, []);

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
