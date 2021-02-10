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
import "./index.scss";
import { useDispatch } from "react-redux";
import { Rectangle } from "electron";
import userDataPath from "../../../../../utils/files/userDataPath";
import { RecordingJson } from "../../../recorder/types";
import {
  recordingPath,
  stepSnapshotPath,
} from "../../../../electron-constants";
import { getRawAudioData } from "../../../recorder/CVEditor";
import rawAudioToWaveform from "../../lesson-utils/rawAudioToWaveform";
import useDebounce from "../../../../hooks/useDebounce";
import saveCanvasImage from "../../../../../utils/saveCanvasImage";
import cropImage from "../../../../../utils/cropImage";
import ButtonSimple from "../../../button-simple";
import VideoNavigation from "../../video-navigation";
import VideoData from "../../video-data";
import beginGenerating from "../beginGenerating";
import Flex from "../../../flex";
import usePopupLoading from "../../../../hooks/usePopupLoading";

const userData = userDataPath();
const captureFileName = `${userData}/capture.png`;

interface GeneratorPopupProps {
  close: () => void;
  id: string;
}

export default function GeneratorPopup(props: GeneratorPopupProps) {
  const { close, id } = props;

  const dispatch = useDispatch();

  const [nav, setNav] = useState([0, 0, 100]);
  const [videoDuration, setVideoDuration] = useState(100);
  const [crop, setCrop] = useState<Rectangle | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [spectrum, setSpectrum] = useState<number[]>([]);
  const [recordingData, setRecordingData] = useState<RecordingJson>();

  const [Loader, setLoading, unsetLoading] = usePopupLoading("Generating");

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
      setRecordingData(json);
    } catch (e) {
      console.warn(
        `.json for recording ${id} does not exist! Some data about it might be unavailable.`
      );
    }

    getRawAudioData(`${recordingPath}aud-${id}.webm`)
      .then((data) => {
        const newSpectrum = rawAudioToWaveform(data);
        setSpectrum(newSpectrum);
      })
      .catch(() => {
        console.warn(`recording ${id} does not have any local audio files.`);
      });
  }, [dispatch]);

  const meoizedSpectrum = useMemo(() => {
    return (
      <div className="spectrum-container">
        {spectrum.map((n, i) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={`spectrum-key-${i}`}
            className="spectrum-bar"
            style={{ height: `${n * 100}%` }}
          />
        ))}
      </div>
    );
  }, [spectrum]);

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
    [nav, debouncer]
  );

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
  }, [videoRef, canvasRef]);

  const generateImageFromArea = useCallback(
    (scale: number) => {
      if (crop && canvasRef.current) {
        updateCanvas();

        return saveCanvasImage(captureFileName, canvasRef.current).then(
          (image) =>
            cropImage(image, {
              x: crop.x / scale,
              y: crop.y / scale,
              width: crop.width / scale,
              height: crop.height / scale,
            })
        );
      }
      return Promise.reject();
    },
    [updateCanvas, canvasRef, crop]
  );

  const onGenerate = useCallback(() => {
    if (videoRef.current && crop && recordingData) {
      const scale =
        videoRef.current.offsetHeight / videoRef.current.videoHeight;

      setLoading();
      generateImageFromArea(scale)
        .then((uri) => {
          setCrop(null);
          return beginGenerating(uri, recordingData, id);
        })
        .then(unsetLoading)
        .catch(unsetLoading);
    }
  }, [
    generateImageFromArea,
    setLoading,
    unsetLoading,
    nav,
    id,
    crop,
    canvasRef,
    videoRef,
  ]);

  const videoDomain = useMemo(() => [0, videoDuration], [videoDuration]);
  const defaultNavigation = useMemo(() => [0, 0, videoDuration], [
    videoDuration,
  ]);

  const Video = useMemo(() => {
    return (
      <video
        id="trim-popup-video"
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
        onSeeked={updateCanvas}
        onLoadStart={(e) => {
          // You must inform ReactCrop when your media has loaded.
          e.target.dispatchEvent(new Event("medialoaded", { bubbles: true }));
        }}
        src={`${recordingPath}/vid-${id}.webm`}
      />
    );
  }, [updateCanvas]);

  return (
    <div className="generator-popup-container">
      <div className="generator-popup">
        <canvas
          id="trim-popup-canvas"
          style={{ display: "none" }}
          ref={canvasRef}
        />
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
        <Flex>
          <ButtonSimple
            disabled={crop?.height == 0 && crop?.width == 0}
            margin="auto"
            width="200px"
            height="24px"
            onClick={onGenerate}
          >
            Generate
          </ButtonSimple>
          <ButtonSimple
            margin="auto"
            width="200px"
            height="24px"
            onClick={close}
          >
            Cancel
          </ButtonSimple>
        </Flex>

        <div style={{ overflow: "hidden" }}>
          <VideoNavigation
            singleNav
            domain={videoDomain}
            defaultValues={defaultNavigation}
            ticksNumber={100}
            callback={debounceVideoNav}
            slideCallback={debounceVideoNav}
            isBackgroundSync
          />
          {recordingData && (
            <VideoData
              recordingData={recordingData}
              videoDuration={videoDuration}
            />
          )}
          {meoizedSpectrum}
        </div>
        <Loader />
      </div>
    </div>
  );
}
