import React, { useCallback, useMemo, useRef, useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/lib/ReactCrop.scss";
import "./video-trim.scss";
import ButtonSimple from "../components/button-simple";
import VideoNavigation from "../components/create-leson-detached/video-navigation";
import { recordingPath } from "../electron-constants";
import useDebounce from "./useDebounce";
import usePopup from "./usePopup";
import { Rectangle } from "../../types/utils";

export default function usePopupVideoAnchor(
  id: string,
  callback: (rect: Rectangle, position: number) => void
): [() => JSX.Element, () => void, () => void] {
  const [Popup, doOpen, close] = usePopup(false);

  const VideoTrimPopup = () => {
    const [nav, setNav] = useState([0, 0, 100]);
    const [videoDuration, setVideoDuration] = useState(100);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [crop, setCrop] = useState<Rectangle | null>(null);

    const debouncer = useDebounce(50);

    const debounceVideoNav = useCallback(
      (n: readonly number[]) => {
        debouncer(() => {
          setNav([...n]);

          nav.forEach((num, i) => {
            if (num !== n[i]) {
              if (videoRef.current) videoRef.current.currentTime = n[i] / 1000;
            }
          });
        });
      },
      [videoRef, nav, debouncer]
    );

    const Video = useMemo(
      () => (
        <video
          key={`trim-popup-video-${id}`}
          muted
          ref={videoRef}
          onLoadedMetadata={(e) => {
            const duration = (e.currentTarget.duration || 0) * 1000;
            const newNav = [...nav];
            newNav[2] = duration;
            setNav(newNav);
            setVideoDuration(duration);
          }}
          onLoadStart={(e) => {
            // You must inform ReactCrop when your media has loaded.
            e.target.dispatchEvent(new Event("medialoaded", { bubbles: true }));
          }}
          src={`${recordingPath}/vid-${id}.webm`}
        />
      ),
      [id]
    );

    const onDone = useCallback(() => {
      if (videoRef.current && crop) {
        const scale =
          videoRef.current.offsetHeight / videoRef.current.videoHeight;
        callback(
          {
            x: crop.x / scale,
            y: crop.y / scale,
            width: crop.width / scale,
            height: crop.height / scale,
          },
          nav[1]
        );
        close();
      }
    }, [callback, nav, crop, videoRef]);

    return (
      <Popup width="calc(100% - 128px)" height="calc(100% - 128px)">
        <div
          style={{
            height: "calc(100% - 240px)",
            margin: "32px auto",
            width: "fit-content",
            overflow: "hidden",
          }}
        >
          <ReactCrop crop={crop} onChange={setCrop} renderComponent={Video} />
        </div>
        <ButtonSimple
          disabled={crop?.height == 0 && crop?.width == 0}
          margin="auto"
          width="200px"
          height="24px"
          onClick={onDone}
        >
          Done
        </ButtonSimple>
        <div style={{ overflow: "hidden" }}>
          <VideoNavigation
            singleNav
            domain={[0, videoDuration]}
            defaultValues={nav}
            ticksNumber={100}
            callback={debounceVideoNav}
            slideCallback={debounceVideoNav}
            isBackgroundSync
          />
        </div>
      </Popup>
    );
  };

  return [VideoTrimPopup, doOpen, close];
}
