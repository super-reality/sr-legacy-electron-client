import {
  useState,
  useEffect,
  useRef,
  SetStateAction,
  RefObject,
  Dispatch,
} from "react";

export default function useInfiniteScroll(
  callback: () => void
): [
  boolean,
  Dispatch<SetStateAction<boolean>>,
  RefObject<HTMLDivElement>,
  Dispatch<SetStateAction<boolean>>
] {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const scrollPanelRef = useRef<HTMLDivElement>(null);
  function handleScroll(scrollPanel: HTMLDivElement) {
    console.log(`HAS MORE : ${hasMore}`);
    if (
      scrollPanel.scrollHeight - scrollPanel.scrollTop !=
        scrollPanel.clientHeight ||
      isFetching ||
      !hasMore
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
    if (hasMore) callback();
  }, [isFetching]);

  useEffect(() => {
    if (!hasMore) setIsFetching(false);
  }, [hasMore]);

  return [isFetching && hasMore, setIsFetching, scrollPanelRef, setHasMore];
}

/*    console.log(
      `STATS \n offsetHeight: ${scrollPanel.offsetHeight} \n scrollTop: ${
        scrollPanel.scrollTop
      } \n scrollHeightt-scrollTop: ${
        scrollPanel.scrollHeight - scrollPanel.scrollTop
      } \n clientHeigh: ${scrollPanel.clientHeight} `
    ); */
