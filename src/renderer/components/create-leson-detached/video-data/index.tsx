import React from "react";
import "./index.scss";
import timestampToTime from "../../../../utils/timestampToTime";
import { RecordingJson } from "../../recorder/types";

interface VideoDataProps {
  recordingData: RecordingJson;
  videoDuration: number;
}

export default function VideoData(props: VideoDataProps) {
  const { recordingData, videoDuration } = props;

  /*
  const {
    recordingCvMatches,
    recordingCvMatchValue,
    recordingCvFrame,
  } = useSelector((state: AppState) => state.createLessonV2);

  const maxCv = 1000 - recordingCvMatchValue;
  */

  return (
    <>
      {/* {<div className="video-cv-data">
        {recordingCvMatches.map((d, i) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={`cv-nav-${i}`}
            className="video-cv-data-item"
            style={{
              left: `calc(${(100 / videoDuration) * 1000 * d.index}% - 4px)`,
              backgroundColor: `rgba(67,181,129,${
                (1 / maxCv) * (d.value * 1000 - recordingCvMatchValue)
              })`,
            }}
          >
            {recordingCvFrame == d.index && (
              <div className="video-cv-data-current" />
            )}
          </div>
        ))}
      </div>} */}
      <div className="video-data">
        {recordingData.step_data.map((s, i) => {
          const named = `${s.type}-${i}-${s.time_stamp}`;
          // eslint-disable-next-line radix
          const time = timestampToTime(s.time_stamp);
          return (
            <div
              className={`video-data-${s.type}`}
              style={{
                left: `${(100 / videoDuration) * time}%`,
              }}
              onClick={() => {
                // n[1] = time;
                // setVideoNavPos(n);
              }}
              key={named}
            />
          );
        })}
      </div>
    </>
  );
}
