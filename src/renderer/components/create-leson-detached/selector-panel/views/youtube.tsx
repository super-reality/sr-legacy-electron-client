import React, { useCallback, useEffect } from "react";
import { BasePanelViewProps } from "../viewTypes";
import usePopupInput from "../../../../hooks/usePopupInput";
import { VideoSourceYoutubeTypeValue } from "../../../../items/item";

export default function YoutubeView(
  props: BasePanelViewProps<VideoSourceYoutubeTypeValue>
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { select, data, open } = props;

  const callback = useCallback((url: string) => {
    select("youtube", url);
  }, []);

  const [Popup, openInput] = usePopupInput(
    "Enter YoutTube video ID:",
    callback
  );

  useEffect(() => openInput(), []);

  return (
    <>
      <Popup />
    </>
  );
}
