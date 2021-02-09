import React, { useState } from "react";
import ButtonSimple from "../../../button-simple";
import ButtonCheckbox from "../../button-checkbox";
import useBasePanel from "../useBasePanel";
import { RecordingsList, RecordingsView } from "../views/recordings";

import { ReactComponent as IconGenerate } from "../../../../../assets/svg/canvas.svg";
import usePopupVideoAnchor from "../../../../hooks/usePopupVideoAnchor";
import { voidFunction } from "../../../../constants";
import useLessonGenerator from "../../../../hooks/useLessonGenerator";

export default function GeneratePanel() {
  const [dataId, setDataId] = useState<string | null>(null);

  const [GeneratorPopup, openGenerator] = useLessonGenerator();

  const [AnchorPopup, doOpenAnchorPopup] = usePopupVideoAnchor(
    dataId || "",
    openGenerator
  );

  const Panel = useBasePanel("Generate from Recording", IconGenerate, {});

  return (
    <>
      <AnchorPopup />
      <GeneratorPopup />
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
