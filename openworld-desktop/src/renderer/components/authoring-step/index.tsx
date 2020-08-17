import React, { useCallback, useState } from "react";
import "./index.scss";
import "../containers.scss";
import "../create-lesson/index.scss";
import InsertMedia from "../insert-media";
import Flex from "../flex";
import Select from "../select";

const CVFnOptions = ["on", "if", "after"]; // ??

const CVTriggerOptions = ["On CV Target Found", "On CV .."]; // ??

const CVActionOptions = ["Read Text", "Do something else"];

const CVNextStepOptions = [
  "After Text finished reading",
  "After click",
  "After stuff",
];

// Should be imported
type InputChangeEv =
  | React.ChangeEvent<HTMLInputElement>
  | React.KeyboardEvent<HTMLInputElement>;

type AreaChangeEv =
  | React.ChangeEvent<HTMLTextAreaElement>
  | React.KeyboardEvent<HTMLTextAreaElement>;

export default function StepAuthoring(): JSX.Element {
  const [CVFn, setCVFn] = useState(CVFnOptions[0]);
  const [CVTrigger, setCVTrigger] = useState(CVTriggerOptions[0]);
  const [CVAction, setCVAction] = useState(CVActionOptions[0]);
  const [CVNextStep, setCVNextStep] = useState(CVNextStepOptions[0]);
  const [stepname, setStepname] = useState("");
  const [description, setDescription] = useState("");
  const [CVImageUrl, setCVImageUrl] = useState("");

  const handleStepnameChange = useCallback((e: InputChangeEv): void => {
    setStepname(e.currentTarget.value);
  }, []);

  const handleDescriptionChange = useCallback((e: AreaChangeEv): void => {
    setDescription(e.currentTarget.value);
  }, []);

  return (
    <div className="step-authoring-grid">
      <Flex>
        <div className="container-with-desc">
          <div>CV Function</div>
          <Select current={CVFn} options={CVFnOptions} callback={setCVFn} />
        </div>
      </Flex>
      <Flex>
        <div className="container-with-desc">
          <div>CV Target</div>
          <InsertMedia
            imgUrl={CVImageUrl}
            style={{ width: "100%", height: "auto" }}
            callback={setCVImageUrl}
          />
        </div>
      </Flex>

      <Flex style={{ gridArea: "step" }}>
        <div className="container-with-desc">
          <div>Step Name</div>
          <input
            placeholder="Step name"
            value={stepname}
            onChange={handleStepnameChange}
            onKeyDown={handleStepnameChange}
          />
        </div>
      </Flex>

      <Flex>
        <div className="container-with-desc">
          <div>Trigger</div>
          <Select
            current={CVTrigger}
            options={CVTriggerOptions}
            callback={setCVTrigger}
          />
        </div>
      </Flex>

      <Flex>
        <div className="container-with-desc">
          <div>Action</div>
          <Select
            current={CVAction}
            options={CVActionOptions}
            callback={setCVAction}
          />
        </div>
      </Flex>

      <Flex style={{ gridArea: "text" }}>
        <div className="container-with-desc">
          <div>Step Description</div>
          <textarea
            style={{ resize: "vertical", minHeight: "64px" }}
            placeholder=""
            value={description}
            onChange={handleDescriptionChange}
            onKeyDown={handleDescriptionChange}
          />
        </div>
      </Flex>

      <Flex>
        <div className="container-with-desc">
          <div>Next Step</div>
          <Select
            current={CVNextStep}
            options={CVNextStepOptions}
            callback={setCVNextStep}
          />
        </div>
      </Flex>
    </div>
  );
}
