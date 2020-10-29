import React, { useCallback } from "react";
import "./index.scss";
import { useDispatch, useSelector } from "react-redux";
import reduxAction from "../../../redux/reduxAction";
import { AppState } from "../../../redux/stores/renderer";

export default function VideoData() {
  const dispatch = useDispatch();
  const {
    recordingData,
    videoNavigation,
    videoDuration,
    recordingCvMatches,
    recordingCvMatchValue,
  } = useSelector((state: AppState) => state.createLessonV2);

  const setVideoNavPos = useCallback(
    (n: readonly number[]) => {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: { videoNavigation: [...n] },
      });
    },
    [dispatch]
  );

  const maxCv = 1000 - recordingCvMatchValue;

  return (
    <>
      <div className="video-cv-data">
        {recordingCvMatches.map((d, i) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={`cv-nav-${i}`}
            className="video-cv-data-item"
            style={{
              opacity: (1 / maxCv) * (d * 1000 - recordingCvMatchValue),
            }}
          />
        ))}
      </div>
      <div className="video-data">
        {recordingData.step_data.map((s) => {
          // eslint-disable-next-line radix
          const time = parseInt(s.time_stamp.replace(/:/g, ""));
          return (
            <div
              className="video-data-click"
              style={{
                left: `${(100 / (videoDuration * 1000)) * time}%`,
              }}
              onClick={() => {
                const n = [...videoNavigation];
                n[1] = time;
                setVideoNavPos(n);
              }}
              key={s.time_stamp}
            />
          );
        })}
      </div>
    </>
  );
}
