import React, { useRef } from "react";
import "./index.scss";

export type EditorMenues =
  | "Create"
  | "Library"
  | "Teach"
  | "Resources"
  | "Help"
  | "Open Source"
  | "File"
  | "Test Menu";

const selectOptionsByMenu: Record<EditorMenues, string[]> = {
  Create: ["Recording", ".."],
  Library: ["library", "etc"],
  Teach: ["Teach", "Teach more", "Lots of teaching"],
  Resources: ["Resources", "Buy stuff"],
  Help: ["Help!", "RTFM"],
  "Open Source": ["Yes please!"],
  
  File: ["Test", "Test1"],
  "Test Menu": ["This is test"],
};

export default function useTopNavDropdown(
  title: EditorMenues | null,
  onSelect: (selected: string) => void
): [() => JSX.Element, React.MutableRefObject<HTMLDivElement | null>] {
  const ref = useRef<HTMLDivElement | null>(null);

  if (title) {
    const currentOptions = selectOptionsByMenu[title];
    const Dropdown = () => (
      <div ref={ref} className="topnav-dropdown-container">
        {currentOptions.map((option) => {
          return (
            <div
              className="option"
              key={`option-${option}`}
              onClick={() => {
                onSelect(option);
              }}
            >
              {option}
            </div>
          );
        })}
      </div>
    );
    return [Dropdown, ref];
  }

  return [() => <></>, ref];
}
