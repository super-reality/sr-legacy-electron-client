import React, { useCallback, useState } from "react";
import "./index.scss";
import "../containers.scss";
import "../create-lesson/index.scss";
import InsertMedia from "../insert-media";
import Flex from "../flex";
import Select from "../select";
import { InputChangeEv, AreaChangeEv } from "../../../types/utils";
import ButtonSimple from "../button-simple";
import { IStep } from "../../../types/api";

const CVFnOptions = ["on", "if", "after"]; // ??

const CVTriggerOptions = ["On CV Target Found", "On CV .."]; // ??

const CVActionOptions = ["Read Text", "Do something else"];

const CVNextStepOptions = [
  "After Text finished reading",
  "After click",
  "After stuff",
];

export default function StepAuthoring(): JSX.Element {
  const [CVFn, setCVFn] = useState(CVFnOptions[0]);
  const [CVTrigger, setCVTrigger] = useState(CVTriggerOptions[0]);
  const [CVAction, setCVAction] = useState(CVActionOptions[0]);
  const [CVNextStep, setCVNextStep] = useState(CVNextStepOptions[0]);
  const [stepname, setStepname] = useState("");
  const [description, setDescription] = useState("");
  const [CVImageUrls, setCVImageUrls] = useState<string[]>([]);

  const insertCVImage = (image: string, index: number) => {
    const arr = [...CVImageUrls];
    arr.splice(index, 1, image);
    setCVImageUrls(arr);
  };

  const handleStepnameChange = useCallback((e: InputChangeEv): void => {
    setStepname(e.currentTarget.value);
  }, []);

  const handleDescriptionChange = useCallback((e: AreaChangeEv): void => {
    setDescription(e.currentTarget.value);
  }, []);

  const addStep = useCallback(() => {
    const newStep: IStep = {
      id: "randomid",
      media: CVImageUrls,
      description,
      name: stepname,
      avatarUrl: "",
      creator: "",
      rating: 0,
      checkState: false,
    };
    // code to add to the steps list here
  }, []);

  const datekey = new Date().getTime();

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
          <Flex style={{ flexDirection: "column" }}>
            {[...CVImageUrls, undefined].map((url, i) => (
              <InsertMedia
                snip
                // eslint-disable-next-line react/no-array-index-key
                key={`insert-media-${datekey}-${i}`}
                imgUrl={url}
                style={{
                  marginBottom: "8px",
                  width: "100%",
                  height: url ? "200px" : "auto",
                }}
                callback={(str) => {
                  insertCVImage(str, i);
                }}
              />
            ))}
          </Flex>
          {/* <InsertMedia
            snip
            imgUrl={CVImageUrl}
            style={{
              width: "100%",
              minHeight: "32px",
              height: CVImageUrl ? "200px" : "auto",
            }}
            callback={setCVImageUrl}
          /> */}
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
      <Flex>
        <ButtonSimple
          margin="8px auto"
          width="100px"
          height="16px"
          onClick={addStep}
        >
          Add Step
        </ButtonSimple>
      </Flex>
    </div>
  );
}
