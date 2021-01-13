import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/lib/ReactCrop.scss";
import "./video-trim.scss";
import ButtonSimple from "../components/button-simple";
import VideoNavigation from "../components/create-leson-detached/video-navigation";
import { recordingPath } from "../electron-constants";
import useDebounce from "./useDebounce";
import usePopup from "./usePopup";
import { Rectangle } from "../../types/utils";

export default function usePopupVideoTrim(
  id: string,
  callback: (rect: Rectangle) => void
): [() => JSX.Element, () => void, () => void] {
  const [Popup, doOpen, close] = usePopup(false);

  const VideoTrimPopup = () => {
    const [nav, setNav] = useState([0, 0, 100]);
    const [videoDuration, setVideoDuration] = useState(100);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [crop, setCrop] = useState<any>({});

    const updateCanvas = useCallback(() => {
      if (videoRef.current && canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        if (ctx) {
          ctx.drawImage(
            videoRef.current,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
        }
      }
    }, [canvasRef, videoRef]);

    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.onloadedmetadata = () => {
          const duration = (videoRef.current?.duration || 0) * 1000;
          setVideoDuration(duration);
        };
      }
    }, [videoRef.current]);

    const debouncer = useDebounce(250);

    const debounceVideoNav = useCallback(
      (n: readonly number[]) => {
        debouncer(() => {
          setNav([...n]);

          nav.forEach((num, i) => {
            if (num !== n[i]) {
              if (videoRef.current) videoRef.current.currentTime = n[i] / 1000;
            }
          });

          updateCanvas();
        });
      },
      [videoRef, nav, updateCanvas, debouncer]
    );

    const videoNavDomain = useMemo(() => [0, videoDuration], [videoDuration]);

    const Video = (
      <video
        muted
        ref={videoRef}
        /*
        onTimeUpdate={(e) => {
          const newNav = [...nav];
          newNav[1] = e.currentTarget.currentTime * 1000;
          setNav(newNav);
        }}
        */
        onLoadStart={(e) => {
          // You must inform ReactCrop when your media has loaded.
          e.target.dispatchEvent(new Event("medialoaded", { bubbles: true }));
        }}
        src={`${recordingPath}/vid-${id}.webm`}
      />
    );

    const onDone = useCallback(() => {
      if (videoRef.current) {
        const scale =
          videoRef.current.offsetHeight / videoRef.current.videoHeight;
        callback({
          x: crop.x / scale,
          y: crop.y / scale,
          width: crop.width / scale,
          height: crop.height / scale,
        });
        close();
      }
    }, [callback, crop, videoRef]);

    return (
      <Popup width="calc(100% - 32px)" height="calc(100% - 32px)">
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
          margin="auto"
          width="200px"
          height="24px"
          onClick={onDone}
        >
          Done
        </ButtonSimple>
        <div>
          <VideoNavigation
            domain={videoNavDomain}
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
