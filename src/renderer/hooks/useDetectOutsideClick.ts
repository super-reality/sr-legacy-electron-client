import { useEffect } from "react";
//  Hook that detect clicks outside of the passed ref

export default function useOutsideClick(ref: any, setFunction: () => void) {
  useEffect(() => {
    //   set state to false when click outside of the elememt
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        console.log("clicked outside");
        setFunction();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}
