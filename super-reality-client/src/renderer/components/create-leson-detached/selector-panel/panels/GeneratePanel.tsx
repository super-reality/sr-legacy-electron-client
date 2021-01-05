import React, { useCallback, useState } from "react";
import ButtonSimple from "../../../button-simple";
import ButtonCheckbox from "../../button-checkbox";
import useBasePanel from "../useBasePanel";
import { ImageFoundList, ImageFoundView } from "../views/imageFound";
import { RecordingsList, RecordingsView } from "../views/recordings";

interface GeneratePanelProps {
  stepId: string;
}

export default function GeneratePanel(props: GeneratePanelProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { stepId } = props;

  const [dataType, setDataType] = useState<string | null>(null);
  const [recording, setRecording] = useState(null);
  const [anchor, setAnchor] = useState(null);
  const [dataId, setDataId] = useState<string | null>(null);

  const doCallback = useCallback((type: string, value: any | null) => {
    if (type == "Recording") setRecording(value);
    if (type == "Image Found") setAnchor(value);
  }, []);

  const doUnCheck = useCallback(
    (type: string) => {
      doCallback(type, null);
    },
    [doCallback]
  );

  const Panel = useBasePanel("Generate from Recording");

  let ListView: ((props: any) => JSX.Element) | null = null;
  let SingleView: ((props: any) => JSX.Element) | null = null;

  let currentValue: any | null = null;
  switch (dataType) {
    // Canvas
    case "Recording":
      ListView = RecordingsList;
      SingleView = RecordingsView;
      currentValue = recording ? [recording] : [];
      break;
    // Start Step
    case "Image Found":
      ListView = ImageFoundList;
      SingleView = ImageFoundView;
      currentValue = anchor ? [anchor] : [];
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
          <ListView value={currentValue} open={setDataId} select={doCallback} />
        </div>
      )}
      {dataType && dataId && SingleView && (
        <div className="panel">
          <SingleView
            id={dataId}
            value={currentValue}
            open={setDataId}
            select={doCallback}
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
