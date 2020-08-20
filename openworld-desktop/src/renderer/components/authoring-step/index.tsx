import React, { useCallback, useState } from "react";
import "./index.scss";
import "../containers.scss";
import "../create-lesson/index.scss";
import { useDispatch } from "react-redux";
import InsertMedia from "../insert-media";
import Flex from "../flex";
import Select from "../select";
import { InputChangeEv, AreaChangeEv } from "../../../types/utils";
import ButtonSimple from "../button-simple";

import {
  CVFn,
  InitalFnOptions,
  FnOptions,
  NextStepOptions,
  TriggerOptions,
  InitialStepType,
} from "../../redux/slices/createLessonSlice";
import reduxAction from "../../redux/reduxAction";

export default function StepAuthoring(): JSX.Element {
  const dispatch = useDispatch();

  const [CVTrigger, setCVTrigger] = useState(Object.keys(TriggerOptions)[0]);
  const [CVNextStep, setCVNextStep] = useState(Object.keys(NextStepOptions)[0]);
  const [stepname, setStepname] = useState("");
  const [description, setDescription] = useState("");
  const [CVImageData, setCVImageData] = useState<CVFn[]>([]);

  const setImageCVFn = (fn: number, index: number) => {
    const arr = [...CVImageData];
    arr[index].fn = fn;
    setCVImageData(arr);
  };

  const insertCVImage = (image: string, index: number) => {
    const arr = [...CVImageData];
    const CVFunction: CVFn = {
      image,
      fn:
        CVImageData.length == 0
          ? InitalFnOptions["Computer vision On"]
          : FnOptions.And,
    };
    arr.splice(index, 1, CVFunction);
    setCVImageData(arr);
  };

  const handleStepnameChange = useCallback((e: InputChangeEv): void => {
    setStepname(e.currentTarget.value);
  }, []);

  const handleDescriptionChange = useCallback((e: AreaChangeEv): void => {
    setDescription(e.currentTarget.value);
  }, []);

  const addStep = useCallback(() => {
    const newStep: InitialStepType = {
      cv: CVImageData,
      icon: "",
      name: stepname,
      description: description,
      trigger: CVTrigger,
      next: CVNextStep,
    };
    // Update current working lesson
    reduxAction(dispatch, { type: "CREATE_LESSON_STEP", arg: newStep });
    // Reset states
    setCVTrigger(Object.keys(TriggerOptions)[0]);
    setCVNextStep(Object.keys(NextStepOptions)[0]);
    setStepname("");
    setDescription("");
    setCVImageData([]);
  }, [dispatch, CVImageData, stepname, description, CVTrigger, CVNextStep]);

  const datekey = new Date().getTime();

  return (
    <div className="step-authoring-grid">
      <>
        <div>Add CV Target</div>
        <Flex style={{ flexDirection: "column" }}>
          {[...CVImageData, undefined].map((d, i) => {
            const fn = d?.fn;
            const url = !d?.image || d?.image == "" ? undefined : d.image;
            const options = i == 0 ? InitalFnOptions : FnOptions;
            const optionKeys: unknown = Object.keys(options);
            return (
              <>
                <InsertMedia
                  snip
                  // eslint-disable-next-line react/no-array-index-key
                  key={`insert-media-${datekey}-${i}`}
                  imgUrl={url}
                  style={{
                    marginBottom: "8px",
                    width: "100%",
                    height: url ? "140px" : "auto",
                  }}
                  callback={(str) => {
                    insertCVImage(str, i);
                  }}
                />
                {fn ? (
                  <div
                    className="container-with-desc"
                    style={{ marginBottom: "16px" }}
                  >
                    <div>Image Function</div>
                    <Select
                      current={fn}
                      options={optionKeys as number[]}
                      callback={(f) => {
                        setImageCVFn(f, i);
                      }}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </>
            );
          })}
        </Flex>
      </>
      <Flex>
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
          <div>Step trigger</div>
          <Select
            current={CVTrigger}
            options={Object.keys(TriggerOptions)}
            callback={setCVTrigger}
          />
        </div>
      </Flex>
      <Flex>
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
            options={Object.keys(NextStepOptions)}
            callback={setCVNextStep}
          />
        </div>
      </Flex>
      <Flex>
        <ButtonSimple
          margin="8px auto"
          width="200px"
          height="24px"
          onClick={addStep}
        >
          Save and add new step
        </ButtonSimple>
      </Flex>
    </div>
  );
}
