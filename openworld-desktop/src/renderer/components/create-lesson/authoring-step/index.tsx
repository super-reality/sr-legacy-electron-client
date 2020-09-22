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
import CVSettings from "../../cv-settings";
import usePopupValidation from "../../../hooks/usePopupValidation";
import makeValidation, {
  ValidationFields,
} from "../../../../utils/makeValidation";

export default function StepAuthoring(): JSX.Element {
  const dispatch = useDispatch();
  const { cvMatchValue } = useSelector((state: AppState) => state.settings);
  const finalData = useSelector((state: AppState) => state.createStep);
  const [creationState, setCreationState] = useState(true);
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
    setThreshold(Math.round(res.dist * 1000));
    createFindBox(res);
    if (res.dist < cvMatchValue / 1000) {
      cvNotFound();
    }
  }, []);

  const [
    CV,
    isCapturing,
    startCV,
    endCV,
    singleCV,
  ] = useCVMatch(finalData.images || [""], cvShow, { cvMatchValue: 0 });

  const doTest = useCallback(() => {
    if (isCapturing) {
      endCV();
    } else {
      // play audio too
      // The CV logic for functions and triggers should be abstracted out
      startCV();
    }
  }, [startCV, endCV, isCapturing]);

  useEffect(() => {
    return () => {
      closeFindBox();
      endCV();
    };
  }, [endCV]);

  const setCVTrigger = (value: number) => {
    Redux({ trigger: value });
  };

  const setCVNextStep = (value: number) => {
    Redux({ next: value });
  };

  const setImageCVFn = useCallback(
    (fn: number, index: number) => {
      const arr = [...finalData.functions];
      arr[index] = fn;
      Redux({ functions: arr });
    },
    [finalData]
  );

  const insertCVImage = useCallback(
    (image: string, index: number) => {
      const imgArr = [...finalData.images];
      imgArr.splice(index, 1, image);

      const defaultFn =
        finalData.functions[index] ||
        (index == 0
          ? Object.values(InitalFnOptions)[0]
          : Object.values(FnOptions)[0]);
      const fnArr = [...finalData.functions];
      fnArr.splice(index, 1, defaultFn);

      Redux({ images: imgArr, functions: fnArr });
    },
    [finalData]
  );

  const handleStepnameChange = useCallback(
    (e: InputChangeEv): void => {
      Redux({ name: e.currentTarget.value });
    },
    [finalData]
  );

  const handleDescriptionChange = useCallback(
    (e: AreaChangeEv): void => {
      Redux({ description: e.currentTarget.value });
    },
    [finalData]
  );

  const [ValidationPopup, open] = usePopupValidation("step");

  const validateFields = useCallback(() => {
    const validation: ValidationFields<IStep> = {
      name: { name: "Name", minLength: 4 },
      description: { name: "Description", minLength: 4 },
      images: { name: "Image", minItems: 1 },
    };
    return makeValidation<IStep>(validation, finalData);
  }, [finalData]);

  const addStep = useCallback(() => {
    const reasons = validateFields();
    if (reasons.length == 0) {
      setCreationState(true);
      if (containerRef.current) {
        reduxAction(dispatch, {
          type: "SET_YSCROLL_MOVE",
          arg: containerRef.current.offsetTop - 150,
        });
      }

      if (finalData.index !== undefined) {
        reduxAction(dispatch, {
          type: "CREATE_LESSON_STEP_REPLACE",
          arg: { step: finalData, index: finalData.index },
        });
      } else {
        reduxAction(dispatch, { type: "CREATE_LESSON_STEP", arg: finalData });
      }

      reduxAction(dispatch, { type: "CREATE_STEP_RESET", arg: null });
    } else {
      setCreationState(false);
      open();
    }
  }, [dispatch, containerRef, finalData, open]);

  const clearStep = useCallback(() => {
    reduxAction(dispatch, { type: "CREATE_STEP_RESET", arg: null });
  }, [dispatch]);

  const datekey = new Date().getTime();

  return (
    <>
      <CV />
      <ValidationPopup validationFn={validateFields} sucess={creationState} />
      <div className="step-authoring-grid" ref={containerRef}>
        <div>Add CV Target</div>
        <Flex style={{ flexDirection: "column" }}>
          {[...finalData.images, undefined].map((image, i) => {
            const defaultFn =
              i == 0
                ? Object.values(InitalFnOptions)[0]
                : Object.values(FnOptions)[0];

            const current = i == 0 ? InitalFnOptions : FnOptions;
            const url = !image || image == "" ? undefined : image;
            const fn = !image ? defaultFn : finalData.functions[i];

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
          value={finalData.name}
          onChange={handleStepnameChange}
        />
        <BaseSelect
          title="Step trigger"
          current={finalData.trigger}
          options={Object.values(TriggerOptions)}
          optionFormatter={constantFormat(TriggerOptions)}
          callback={setCVTrigger}
        />
        <BaseTextArea
          title="Step Description"
          placeholder=""
          value={finalData.description}
          onChange={handleDescriptionChange}
        />
        <BaseSelect
          title="Next Step"
          current={finalData.next}
          options={Object.values(NextStepOptions)}
          optionFormatter={constantFormat(NextStepOptions)}
          callback={setCVNextStep}
        />
        <Flex column>
          <CVSettings />
          {isCapturing ? (
            <canvas
              id="canvasTestOutput"
              style={{ width: "200px", margin: "auto" }}
            />
          ) : (
            <></>
          )}
          <div
            style={{
              textAlign: "center",
              color: `var(--color-${
                cvMatchValue > thresholdFound ? "red" : "green"
              })`,
            }}
          >
            {thresholdFound}
          </div>
          <ButtonSimple
            margin="8px auto"
            width="180px"
            height="24px"
            onClick={doTest}
          >
            {isCapturing ? "Stop CV Test" : "Begin CV Test"}
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
            {finalData.index !== undefined
              ? "Save step changes"
              : "Save and add new step"}
          </ButtonSimple>
        </Flex>
      </div>
    </>
  );
}
