import { MutableRefObject, useRef } from "react";
import "./index.scss";

export type EditorMenues =
  | "Create"
  | "Library"
  | "Teach"
  | "Resources"
  | "Help"
  | "Open Source";

const selectOptionsByMenu: Record<EditorMenues, string[]> = {
  Create: ["Recording", ".."],
  Library: ["library", "etc"],
  Teach: ["Teach", "Teach more", "Lots of teaching"],
  Resources: ["Resources", "Buy stuff"],
  Help: ["Help!", "RTFM"],
  "Open Source": ["Yes please!"],
};

export default function useTopNavDropdown(
  title: EditorMenues | null,
  onSelect: (selected: string) => void
): [() => JSX.Element, MutableRefObject<HTMLDivElement | null>] {
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
