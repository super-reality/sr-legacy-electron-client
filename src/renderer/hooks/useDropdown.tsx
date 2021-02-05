import React, { useCallback, useMemo, useRef, useState } from "react";
import "./index.scss";
import useOutsideClick from "./useOutsideClick";

interface Menu {
  title: string;
  id?: string;
}

export default function useDropdown(
  menues: Menu[],
  onSelect: (selected: string) => void
): [() => JSX.Element, (x: number, y: number) => void] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const pos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useOutsideClick(ref, () => setOpen(false));

  const doOpen = useCallback((x: number, y: number) => {
    pos.current.x = x;
    pos.current.y = y;
    setOpen(true);
  }, []);

  const Dropdown = useMemo(
    () => () => (
      <>
        {open && (
          <div
            ref={ref}
            style={{ left: `${pos.current.x}px`, top: `${pos.current.y}px` }}
            className="topnav-dropdown-container"
          >
            {menues.map((option) => {
              return (
                <div
                  className="option"
                  key={`option-${option.id || option.title}`}
                  onClick={() => {
                    onSelect(option.id || option.title);
                  }}
                >
                  {option.title}
                </div>
              );
            })}
          </div>
        )}
      </>
    ),
    [open]
  );

  return [Dropdown, doOpen];
}
