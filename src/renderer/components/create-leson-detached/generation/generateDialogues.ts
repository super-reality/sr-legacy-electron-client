import getSTT from "../../../../utils/api/getSTT";
import timestampToTime from "../../../../utils/timestampToTime";
import trimAudio from "../../../../utils/trimAudio";
import { recordingPath, tempPath } from "../../../electron-constants";
import store from "../../../redux/stores/renderer";
import newItem from "../lesson-utils/newItem";
import setStatus from "../lesson-utils/setStatus";
import { GeneratedData } from "./types";

interface AudioPiece {
  time: number;
  step: string;
  name: string;
  text: string;
}

function makeDialogsFromPieces(
  baseData: GeneratedData,
  pieces: AudioPiece[]
): Promise<GeneratedData> {
  const newData = { ...baseData };
  console.log("Audio Pieces", pieces);

  setStatus(`Pushing dialogues`);
  const promises = pieces.map((p) => {
    return newItem(
      {
        type: "dialog",
        text: p.text,
        anchor: false,
        endOn: [],
        relativePos: {
          width: 300,
          height: 140,
          horizontal: 98,
          vertical: 98,
          x: 0,
          y: 0,
        },
      },
      baseData.steps[p.step]._id
    ).then((item) => {
      if (item) {
        newData.items[p.name] = item;
      }
    });
  });

  return Promise.all(promises).then(() => newData);
}

export default async function generateDialogues(
  baseData: GeneratedData
): Promise<GeneratedData> {
  const audioPieces: AudioPiece[] = [];
  const { recordingData, currentRecording } = store.getState().createLessonV2;

  // Split the recording data between clicks
  let last = 0;
  recordingData.step_data.forEach((data) => {
    const stepName = `step ${data.time_stamp}`;
    const itemName = `dialog ${data.time_stamp}`;
    const timestamp = data.time_stamp;
    const timestampTime = timestampToTime(timestamp);
    const seconds = timestampTime / 1000;
    if (data.type == "left_click" || data.type == "right_click") {
      audioPieces.push({
        time: last,
        step: stepName,
        name: itemName,
        text: "",
      });
    }
    last = seconds;
  });

  setStatus(`Audio triming (-/${audioPieces.length})`);
  // Chain promises to call STT and get the strings

  for (let index = 0; index < audioPieces.length; index += 1) {
    const piece = audioPieces[index];

    const from = piece.time;
    const to = audioPieces[index + 1]?.time ?? last;

    console.log(`trimAudio from ${from} to ${to} (${to - from})`);
    setStatus(`Audio triming (${index + 1}/${audioPieces.length})`);
    // eslint-disable-next-line no-await-in-loop
    await trimAudio(
      `${from}`,
      `${to - from}`,
      `${recordingPath}aud-${currentRecording}.webm`,
      `${tempPath}${from}-${to}.webm`
    )
      .then((file) =>
        getSTT(file).then((text) => {
          if (text !== "Google Speech Recognition could not understand audio") {
            audioPieces[index].text = text;
          }
        })
      )
      .catch(console.error);
  }

  return makeDialogsFromPieces(
    baseData,
    audioPieces.filter((p) => p.text !== "")
  );
}
