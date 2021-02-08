import React, { useState } from "react";
import ButtonSimple from "../../../button-simple";
import ButtonCheckbox from "../../button-checkbox";
import useBasePanel from "../useBasePanel";
import { RecordingsList, RecordingsView } from "../views/recordings";

import { ReactComponent as IconGenerate } from "../../../../../assets/svg/canvas.svg";
import usePopupVideoAnchor from "../../../../hooks/usePopupVideoAnchor";
import { voidFunction } from "../../../../constants";

export default function GeneratePanel() {
  const [dataId, setDataId] = useState<string | null>(null);

  /*
  const doGenerate = useCallback(() => {
    reduxAction(dispatch, {
      type: "CLEAR_RECORDING_CV_DATA",
      arg: null,
    });

    if (anchorObj) {
      setStatus(`Generating`);
      const generatedData = generateBaseData();
      generateSteps(generatedData)
        .then((data) => generateDialogues(data))
        .then((data) => generateClicks(data, anchorObj))
        .then(() => generationDone())
        .catch((e) => {
          logger("error", e);
          console.error(e);
          clearTempFolder();
          setStatus(`Error generating`);
        });
    } else {
      setStatus(`No anchor selected`);
    }
  }, [anchor, treeAnchors]);
  */

  /*
  const checkAnchor = useCallback(() => {
    reduxAction(dispatch, {
      type: "CLEAR_RECORDING_CV_DATA",
      arg: null,
    });
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: {
        currentItem: undefined,
        currentStep: undefined,
        currentAnchor: recordingData.anchor,
        recordingCvFrame: 0,
      },
    });
    testFullVideo(anchor);
  }, [recordingData, anchor]);
  */

  const [AnchorPopup, doOpenAnchorPopup] = usePopupVideoAnchor(
    dataId || "",
    console.log
  );

  const Panel = useBasePanel("Generate from Recording", IconGenerate, {});

  return (
    <>
      <AnchorPopup />
      <Panel>
        <div className="panel">
          <ButtonCheckbox
            key="panel-button-recording"
            text="Recording"
            check={false}
          />
        </div>
        <div className="panel">
          <RecordingsList data={[]} open={setDataId} select={voidFunction} />
        </div>
        {dataId && (
          <div className="panel">
            <RecordingsView
              key={`single-view-${dataId}`}
              id={dataId}
              data={[]}
              open={setDataId}
              noUpload
              select={voidFunction}
            />
            <ButtonSimple
              width="145px"
              height="20px"
              margin="8px auto"
              onClick={doOpenAnchorPopup}
            >
              Start
            </ButtonSimple>
          </div>
        )}
      </Panel>
    </>
  );
}
