import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import fs from "fs";
import ReactCrop from "react-image-crop";
import "react-image-crop/lib/ReactCrop.scss";
import "./video-trim.scss";
import { useDispatch, useSelector } from "react-redux";
import ButtonSimple from "../components/button-simple";
import VideoNavigation from "../components/create-leson-detached/video-navigation";
import { recordingPath, stepSnapshotPath } from "../electron-constants";
import useDebounce from "./useDebounce";
import usePopup from "./usePopup";
import { Rectangle } from "../../types/utils";
import { RecordingJson } from "../components/recorder/types";
import { getRawAudioData } from "../components/recorder/CVEditor";
import reduxAction from "../redux/reduxAction";
import rawAudioToWaveform from "../components/create-leson-detached/lesson-utils/rawAudioToWaveform";
import VideoData from "../components/create-leson-detached/video-data";
import { AppState } from "../redux/stores/renderer";

export default function usePopupVideoAnchor(
  id: string,
  callback: (rect: Rectangle, position: number) => void
): [() => JSX.Element, () => void, () => void] {
  const [Popup, doOpen, close] = usePopup(false);
  const dispatch = useDispatch();

  const { recordingData } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  useEffect(() => {
    let json: RecordingJson = {
      step_data: [],
      spectrum: [],
    };

    try {
      const file = fs
        .readFileSync(`${stepSnapshotPath}/${id}.webm.json`)
        .toString("utf8");
      json = JSON.parse(file);
    } catch (e) {
      console.warn(
        `.json for recording ${id} does not exist! Some data about it might be unavailable.`
      );
    }
    getRawAudioData(`${recordingPath}aud-${id}.webm`)
      .then((data) => {
        reduxAction(dispatch, {
          type: "SET_RECORDING_DATA",
          arg: { spectrum: rawAudioToWaveform(data) },
        });
      })
      .catch(() => {
        console.warn(`recording ${id} does not have any local audio files.`);
      });
    reduxAction(dispatch, {
      type: "SET_RECORDING_DATA",
      arg: json,
    });
    reduxAction(dispatch, {
      type: "CLEAR_RECORDING_CV_DATA",
      arg: null,
    });
  }, [id, dispatch]);

  const meoizedSpectrum = useMemo(() => {
    return (
      <div className="spectrum-container">
        {recordingData.spectrum.map((n, i) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={`spectrum-key-${i}`}
            className="spectrum-bar"
            style={{ height: `${n * 100}%` }}
          />
        ))}
      </div>
    );
  }, [recordingData]);

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
          <VideoData />
          {meoizedSpectrum}
        </div>
      </Popup>
    );
  };

  return [VideoTrimPopup, doOpen, close];
}
