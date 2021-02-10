import React, { useState } from "react";
import ButtonSimple from "../../../button-simple";
import ButtonCheckbox from "../../button-checkbox";
import useBasePanel from "../useBasePanel";
import { RecordingsList, RecordingsViewNoSlider } from "../views/recordings";

import { ReactComponent as IconGenerate } from "../../../../../assets/svg/canvas.svg";
import { voidFunction } from "../../../../constants";
import _beginGenerating from "../../generation/beginGenerating";
import GeneratorPopup from "../../generation/generator-popup";

export default function GeneratePanel() {
  const [dataId, setDataId] = useState<string | null>(null);

  const Panel = useBasePanel("Generate from Recording", IconGenerate, {});

  const [openGenerator, setOpenGenerator] = useState(false);

  return (
    <>
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
            {openGenerator && (
              <GeneratorPopup
                id={dataId}
                close={() => setOpenGenerator(false)}
              />
            )}

            <RecordingsViewNoSlider
              key={`single-recording-view-${dataId}`}
              id={dataId}
              data={[]}
              open={setDataId}
              select={voidFunction}
            />
            <ButtonSimple
              width="145px"
              height="20px"
              margin="8px auto"
              onClick={() => setOpenGenerator(true)}
            >
              Start
            </ButtonSimple>
          </div>
        )}
      </Panel>
    </>
  );
}
