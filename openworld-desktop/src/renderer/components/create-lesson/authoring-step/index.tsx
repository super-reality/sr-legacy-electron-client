import React, { useCallback, useEffect, useRef, useState } from "react";
import "./index.scss";
import "../../containers.scss";
import { useDispatch, useSelector } from "react-redux";
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
import { AppState } from "../../../redux/stores/renderer";
import createFindBox from "../../../../utils/createFindBox";
import useCVMatch, { CVResult } from "../../../hooks/useCVMatch";
import closeFindBox from "../../../../utils/closeFindBox";

export default function StepAuthoring(): JSX.Element {
  const dispatch = useDispatch();
  const stepData = useSelector((state: AppState) => state.createStep);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [thresholdFound, setThreshold] = useState<number>(0);

  const Redux = useCallback(
    (arg: Partial<IStep>) => {
      reduxAction(dispatch, {
        type: "CREATE_STEP_DATA",
        arg,
      });
    },
    [dispatch]
  );

  const [CVPopup, cvNotFound, closeCvNotFound] = usePopup(false);

  const cvShow = useCallback((res: CVResult) => {
    setThreshold(res.dist);
    createFindBox(res);
    if (res.dist < 0.97) {
      cvNotFound();
    }
  }, []);

  useEffect(() => {
    return () => {
      closeFindBox();
    };
  }, []);

  const [CV, isCapturing, startCV, endCV, singleCV] = useCVMatch(
    stepData.images[0] || "",
    cvShow,
    { threshold: 0 }
  );

  const doTest = useCallback(() => {
    // play audio too
    // The CV logic for functions and triggers should be abstracted out
    singleCV();
  }, [singleCV]);

  const setCVTrigger = (value: number) => {
    Redux({ trigger: value });
  };

  const setCVNextStep = (value: number) => {
    Redux({ next: value });
  };

  const setImageCVFn = useCallback(
    (fn: number, index: number) => {
      const arr = [...stepData.functions];
      arr[index] = fn;
      Redux({ functions: arr });
    },
    [stepData]
  );

  const insertCVImage = useCallback(
    (image: string, index: number) => {
      const imgArr = [...stepData.images];
      imgArr.splice(index, 1, image);

      const defaultFn =
        stepData.functions[index] ||
        (index == 0
          ? Object.values(InitalFnOptions)[0]
          : Object.values(FnOptions)[0]);
      const fnArr = [...stepData.functions];
      fnArr.splice(index, 1, defaultFn);

      Redux({ images: imgArr, functions: fnArr });
    },
    [stepData]
  );

  const handleStepnameChange = useCallback(
    (e: InputChangeEv): void => {
      Redux({ name: e.currentTarget.value });
    },
    [stepData]
  );

  const handleDescriptionChange = useCallback(
    (e: AreaChangeEv): void => {
      Redux({ description: e.currentTarget.value });
    },
    [stepData]
  );

  const [Popup, open, closePopup] = usePopup(false);

  const addStep = useCallback(() => {
    if (stepData.images.length < 1 || stepData.name.length < 1) {
      open();
      return;
    }
    if (containerRef.current) {
      reduxAction(dispatch, {
        type: "SET_YSCROLL_MOVE",
        arg: containerRef.current.offsetTop - 150,
      });
    }

    if (stepData.index !== undefined) {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_STEP_REPLACE",
        arg: { step: stepData, index: stepData.index },
      });
    } else {
      reduxAction(dispatch, { type: "CREATE_LESSON_STEP", arg: stepData });
    }

    reduxAction(dispatch, { type: "CREATE_STEP_RESET", arg: null });
  }, [dispatch, containerRef, stepData]);

  const clearStep = useCallback(() => {
    reduxAction(dispatch, { type: "CREATE_STEP_RESET", arg: null });
  }, [dispatch]);

  const datekey = new Date().getTime();

  return (
    <>
      <CV />
      <CVPopup width="400px" height="auto">
        <div className="validation-popup">
          <div className="title">Not found</div>
          <div className="line">No suitable targets could be found.</div>
          <div className="line">
            Distance: {Math.round(thresholdFound * 1000) / 1000}
          </div>
          <div className="line">Threshold: &gt; 0.970</div>
          <ButtonSimple className="button" onClick={closeCvNotFound}>
            Ok
          </ButtonSimple>
        </div>
      </CVPopup>
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
      <div className="step-authoring-grid" ref={containerRef}>
        <div>Add CV Target</div>
        <Flex style={{ flexDirection: "column" }}>
          {[...stepData.images, undefined].map((image, i) => {
            const defaultFn =
              i == 0
                ? Object.values(InitalFnOptions)[0]
                : Object.values(FnOptions)[0];

            const current = i == 0 ? InitalFnOptions : FnOptions;
            const url = !image || image == "" ? undefined : image;
            const fn = !image ? defaultFn : stepData.functions[i];

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
          value={stepData.name}
          onChange={handleStepnameChange}
        />
        <BaseSelect
          title="Step trigger"
          current={stepData.trigger}
          options={Object.values(TriggerOptions)}
          optionFormatter={constantFormat(TriggerOptions)}
          callback={setCVTrigger}
        />
        <BaseTextArea
          title="Step Description"
          placeholder=""
          value={stepData.description}
          onChange={handleDescriptionChange}
        />
        <BaseSelect
          title="Next Step"
          current={stepData.next}
          options={Object.values(NextStepOptions)}
          optionFormatter={constantFormat(NextStepOptions)}
          callback={setCVNextStep}
        />
        <Flex column>
          <ButtonSimple
            margin="8px auto"
            width="180px"
            height="24px"
            onClick={doTest}
          >
            Test CV
          </ButtonSimple>
          <ButtonSimple
            margin="8px auto"
            width="180px"
            height="24px"
            onClick={clearStep}
          >
            Clear Step (does not save)
          </ButtonSimple>
          <ButtonSimple
            margin="8px auto"
            width="180px"
            height="24px"
            onClick={addStep}
          >
            {stepData.index !== undefined
              ? "Save step changes"
              : "Save and add new step"}
          </ButtonSimple>
        </Flex>
      </div>
    </>
  );
}
