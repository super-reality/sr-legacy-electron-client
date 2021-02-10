import uploadFileToS3 from "../../../../utils/api/uploadFileToS3";
import generateBaseData from "./generateBaseData";
import generateSteps from "./generateSteps";
import generationDone from "./generationDone";
import clearTempFolder from "../lesson-utils/clearTempFolder";
import newAnchor from "../lesson-utils/newAnchor";
import setStatus from "../lesson-utils/setStatus";
import { RecordingJson } from "../../recorder/types";
import generateDialogues from "./generateDialogues";
import generateClicks from "./generateClicks";

export default function beginGenerating(
  anchorUri: string,
  recordingData: RecordingJson,
  recordingId: string
) {
  setStatus(`Creating anchor`);
  return uploadFileToS3(anchorUri).then((url) =>
    newAnchor({
      name: "New Anchor",
      type: "crop",
      templates: [url],
      anchorFunction: "or",
      cvMatchValue: 990,
      cvCanvas: 100,
      cvDelay: 50,
      cvGrayscale: true,
      cvApplyThreshold: false,
      cvThreshold: 127,
    }).then((anchorObj) => {
      if (anchorObj) {
        setStatus(`Generating`);
        const generatedData = generateBaseData(recordingData);
        return generateSteps(generatedData, recordingData, recordingId)
          .then((data) => generateDialogues(data, recordingData, recordingId))
          .then((data) => generateClicks(data, anchorObj, recordingData))
          .then(() => generationDone())
          .catch((e) => {
            console.error(e);
            clearTempFolder();
            setStatus(`Error generating`);
          });
      }
      setStatus(`Error creating anchor`);
      return Promise.reject();
    })
  );
}
