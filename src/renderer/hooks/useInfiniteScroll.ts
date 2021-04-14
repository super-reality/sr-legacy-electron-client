import { useState, useEffect, useRef } from "react";

export default function useInfiniteScroll(
  callback: () => void
): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
  React.RefObject<HTMLDivElement>
] {
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const scrollPanelRef = useRef<HTMLDivElement>(null);
  function handleScroll(scrollPanel: HTMLDivElement) {
    if (
      scrollPanel.scrollHeight - scrollPanel.scrollTop !=
        scrollPanel.clientHeight ||
      isFetching
    ) {
      return;
    }

    setIsFetching(true);
  }

  useEffect(() => {
    const scrollPanel = scrollPanelRef.current;
    if (scrollPanel) {
      scrollPanel.addEventListener("scroll", () => handleScroll(scrollPanel));
    }

    return () =>
      scrollPanel?.removeEventListener("scroll", () =>
        handleScroll(scrollPanel)
      );
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    callback();
  }, [isFetching]);

  return [isFetching, setIsFetching, scrollPanelRef];
}

/*    console.log(
      `STATS \n offsetHeight: ${scrollPanel.offsetHeight} \n scrollTop: ${
        scrollPanel.scrollTop
      } \n scrollHeightt-scrollTop: ${
        scrollPanel.scrollHeight - scrollPanel.scrollTop
      } \n clientHeigh: ${scrollPanel.clientHeight} `
    ); */
