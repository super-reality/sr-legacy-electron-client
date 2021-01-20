import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import logger from "../../../../../utils/logger";
import reduxAction from "../../../../redux/reduxAction";
import { AppState } from "../../../../redux/stores/renderer";
import ButtonSimple from "../../../button-simple";
import ButtonCheckbox from "../../button-checkbox";
import generateBaseData from "../../generation/generateBaseData";
import generateClicks from "../../generation/generateClicks";
import generateDialogues from "../../generation/generateDialogues";
import generateSteps from "../../generation/generateSteps";
import generationDone from "../../generation/generationDone";
import clearTempFolder from "../../lesson-utils/clearTempFolder";
import setStatus from "../../lesson-utils/setStatus";
import useBasePanel from "../useBasePanel";
import { ImageFoundList, ImageFoundView } from "../views/imageFound";
import { RecordingsList, RecordingsView } from "../views/recordings";

import { ReactComponent as IconGenerate } from "../../../../../assets/svg/generate-steps.svg";

export default function GeneratePanel() {
  const dispatch = useDispatch();
  const { treeAnchors } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  const [dataType, setDataType] = useState<string | null>(null);
  const [recording, setRecording] = useState(null);
  const [anchor, setAnchor] = useState<string | null>(null);
  const [dataId, setDataId] = useState<string | null>(null);

  const doGenerate = useCallback(() => {
    reduxAction(dispatch, {
      type: "CLEAR_RECORDING_CV_DATA",
      arg: null,
    });

    const anchorObj = treeAnchors[anchor || ""] || null;

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

  const doCallback = useCallback((type: string, value: any | null) => {
    if (type == "Recording") {
      setRecording(value);
    }
    if (type == "Image Found") {
      reduxAction(dispatch, {
        type: "SET_RECORDING_DATA",
        arg: { anchor: value },
      });
      setAnchor(value);
    }
  }, []);

  const doUnCheck = useCallback(
    (type: string) => {
      doCallback(type, null);
    },
    [doCallback]
  );

  const Panel = useBasePanel("Generate from Recording", IconGenerate, {});

  let ListView: ((props: any) => JSX.Element) | null = null;
  let SingleView: ((props: any) => JSX.Element) | null = null;

  const currentValue = [
    { type: "Image Found", value: anchor },
    { type: "Recording", value: recording },
  ];

  switch (dataType) {
    // Canvas
    case "Recording":
      ListView = RecordingsList;
      SingleView = RecordingsView;
      break;
    // Start Step
    case "Image Found":
      ListView = ImageFoundList;
      SingleView = ImageFoundView;
      break;
    default:
      break;
  }

  return (
    <Panel>
      <div className="panel">
        <ButtonCheckbox
          key="panel-button-recording"
          text="Recording"
          check={!!recording}
          onButtonClick={() => {
            setDataType("Recording");
            setDataId(null);
          }}
          onCheckClick={(e) => {
            e.stopPropagation();
            doUnCheck("Recording");
          }}
        />
        <ButtonCheckbox
          key="panel-button-anchor"
          text="Image"
          check={!!anchor}
          onButtonClick={() => {
            setDataType("Image Found");
            setDataId(null);
          }}
          onCheckClick={(e) => {
            e.stopPropagation();
            doUnCheck("Image Found");
          }}
        />
      </div>
      {dataType && ListView && (
        <div className="panel">
          <ListView data={currentValue} open={setDataId} select={doCallback} />
        </div>
      )}
      {dataType && dataId && SingleView && (
        <div className="panel">
          <SingleView
            key={`single-view-${dataId}`}
            id={dataId}
            data={currentValue}
            open={setDataId}
            select={doCallback}
            noUpload
          />
          {dataType == "Recording" && (
            <>
              {!anchor && (
                <div style={{ textAlign: "center" }}>
                  You need to select an anchor image before generating
                </div>
              )}
              <ButtonSimple
                disabled={!anchor}
                width="145px"
                height="20px"
                margin="8px auto"
                onClick={anchor ? doGenerate : undefined}
              >
                Generate Steps
              </ButtonSimple>
            </>
          )}
        </div>
      )}
    </Panel>
  );
}
