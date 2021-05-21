import { MutableRefObject, useEffect } from "react";

// hook to detect click outside the element
// arguments are reference to the element and the callback function
export default function useOutsideClick(
  ref: MutableRefObject<HTMLDivElement | null>,
  callback: () => void
) {
  const handleClick = (e: any) => {
    e.preventDefault();
    if (ref.current && !ref.current.contains(e.currentTarget)) {
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
