import { MutableRefObject, useEffect } from "react";

export default function useOutsideClick(
  ref: MutableRefObject<HTMLDivElement | null>,
  callback: () => void
) {
  const handleClick = (e: any) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  });
}
