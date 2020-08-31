import React, { useCallback, useState } from "react";
import "./index.scss";
import "../../containers.scss";
import { useDispatch } from "react-redux";
import InsertMedia from "../../insert-media";
import Flex from "../../flex";
import Select from "../../select";
import { InputChangeEv, AreaChangeEv } from "../../../../types/utils";
import ButtonSimple from "../../button-simple";
import reduxAction from "../../../redux/reduxAction";
import {
  TriggerOptions,
  NextStepOptions,
  InitalFnOptions,
  FnOptions,
  IStep,
} from "../../../api/types/step/step";
import constantFormat from "../../../../utils/constantFormat";
import BaseInput from "../../base-input";
import BaseSelect from "../../base-select";
import BaseTextArea from "../../base-textarea";
import usePopup from "../../../hooks/usePopup";

type TriggerKeys = keyof typeof TriggerOptions;
type NextStepKeys = keyof typeof NextStepOptions;

export default function StepAuthoring(): JSX.Element {
  const dispatch = useDispatch();

  const [CVTrigger, setCVTrigger] = useState(Object.keys(TriggerOptions)[0]);
  const [CVNextStep, setCVNextStep] = useState(Object.keys(NextStepOptions)[0]);
  const [stepname, setStepname] = useState("");
  const [description, setDescription] = useState("");
  const [CVImages, setCVImages] = useState<string[]>([]);
  const [CVFunctions, setCVFunctions] = useState<number[]>([]);

  const setImageCVFn = (fn: number, index: number) => {
    const arr = [...CVFunctions];
    arr[index] = fn;
    setCVFunctions(arr);
  };

  const insertCVImage = useCallback(
    (image: string, index: number) => {
      const imgArr = [...CVImages];
      imgArr.splice(index, 1, image);
      setCVImages(imgArr);

      const defaultFn =
        CVFunctions[index] ||
        (index == 0
          ? Object.values(InitalFnOptions)[0]
          : Object.values(FnOptions)[0]);
      const fnArr = [...CVFunctions];
      fnArr.splice(index, 1, defaultFn);
      setCVFunctions(fnArr);
    },
    [CVImages, CVFunctions]
  );

  const handleStepnameChange = useCallback((e: InputChangeEv): void => {
    setStepname(e.currentTarget.value);
  }, []);

  const handleDescriptionChange = useCallback((e: AreaChangeEv): void => {
    setDescription(e.currentTarget.value);
  }, []);

  const [Popup, open, closePopup] = usePopup(false);

  const addStep = useCallback(() => {
    if (CVImages.length < 1 || stepname.length < 1) {
      open();
      return;
    }
    const newStep: IStep = {
      images: CVImages,
      functions: CVFunctions,
      name: stepname,
      description: description,
      trigger: TriggerOptions[CVTrigger as TriggerKeys],
      next: NextStepOptions[CVNextStep as NextStepKeys],
    };
    // Update current working lesson
    reduxAction(dispatch, { type: "CREATE_LESSON_STEP", arg: newStep });
    // Reset states
    setCVTrigger(Object.keys(TriggerOptions)[0]);
    setCVNextStep(Object.keys(NextStepOptions)[0]);
    setStepname("");
    setDescription("");
    setCVImages([]);
    setCVFunctions([]);
  }, [dispatch, CVImages, stepname, description, CVTrigger, CVNextStep]);

  const datekey = new Date().getTime();

  return (
    <>
      <Popup width="400px" height="auto">
        <div className="validation-popup">
          <div className="title">Step Creation failed</div>
          <div className="line">
            Please insert at least one Image and step name
          </div>
          <ButtonSimple className="button" onClick={closePopup}>
            Ok
          </ButtonSimple>
        </div>
      </Popup>
      <div className="step-authoring-grid">
        <div>Add CV Target</div>
        <Flex style={{ flexDirection: "column" }}>
          {[...CVImages, undefined].map((image, i) => {
            const defaultFn =
              i == 0
                ? Object.values(InitalFnOptions)[0]
                : Object.values(FnOptions)[0];

            const current = i == 0 ? InitalFnOptions : FnOptions;
            const url = !image || image == "" ? undefined : image;
            const fn = !image ? defaultFn : CVFunctions[i];

            return (
              <React.Fragment key={image || "cv-add"}>
                <InsertMedia
                  snip
                  // eslint-disable-next-line react/no-array-index-key
                  key={`insert-media-${datekey}-${i}`}
                  imgUrl={url}
                  style={{
                    marginBottom: "8px",
                    width: "100%",
                  }}
                  callback={(str) => {
                    insertCVImage(str, i);
                  }}
                />
                {image ? (
                  <div
                    className="container-with-desc"
                    style={{ marginBottom: "16px" }}
                  >
                    <div>Image Function</div>
                    <Select
                      current={fn}
                      options={Object.values(current)}
                      optionFormatter={constantFormat(current)}
                      callback={(f) => {
                        setImageCVFn(f, i);
                      }}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </React.Fragment>
            );
          })}
        </Flex>
        <BaseInput
          title="Step Name"
          placeholder="Step name"
          value={stepname}
          onChange={handleStepnameChange}
        />
        <BaseSelect
          title="Step trigger"
          current={CVTrigger}
          options={Object.keys(TriggerOptions)}
          callback={setCVTrigger}
        />
        <BaseTextArea
          title="Step Description"
          placeholder=""
          value={description}
          onChange={handleDescriptionChange}
        />
        <BaseSelect
          title="Next Step"
          current={CVNextStep}
          options={Object.keys(NextStepOptions)}
          callback={setCVNextStep}
        />
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
    </>
  );
}
