import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import Flex from "../../flex";
import store, { AppState } from "../../../redux/stores/renderer";
import reduxAction from "../../../redux/reduxAction";
import { Tabs, TabsContainer } from "../../tabs";
import ButtonRound from "../../button-round";

import { ReactComponent as IconAdd } from "../../../../assets/svg/add.svg";
import usePopupImageSource from "../../../hooks/usePopupImageSource";
import newAnchor from "../lesson-utils/newAnchor";
import ModalList from "../modal-list";
import { IStep } from "../../../api/types/step/step";
import updateStep from "../lesson-utils/updateStep";
import { IAnchor } from "../../../api/types/anchor/anchor";
import uploadFileToS3 from "../../../../utils/api/uploadFileToS3";
import pendingReduxAction from "../../../redux/utils/pendingReduxAction";
import editStepItemsRelativePosition from "../lesson-utils/editStepItemsRelativePosition";
import BaseInput from "../../base-input";
import useDebounce from "../../../hooks/useDebounce";

function doNewAnchor(url: string, stepId: string) {
  return newAnchor(
    {
      name: "New Anchor",
      type: "crop",
      templates: [url],
      anchorFunction: "or",
      cvMatchValue: 990,
      cvCanvas: 100,
      cvDelay: 50,
      cvGrayscale: true,
      cvApplyThreshold: false,
      cvThreshold: 127,
    },
    stepId
  );
}

function newAnchorPre(
  file: string,
  stepId: string
): Promise<IAnchor | undefined> {
  if (file.indexOf("http") == -1) {
    return uploadFileToS3(file).then((f) => doNewAnchor(f, stepId));
  }
  return doNewAnchor(file, stepId);
}

interface OpenStepProps {
  id: string;
}

type StepModalOptions = "Settings" | "Anchor";
const stepModalOptions: StepModalOptions[] = ["Settings", "Anchor"];

export default function OpenStep(props: OpenStepProps) {
  const dispatch = useDispatch();
  const { treeSteps, treeAnchors, currentAnchor } = useSelector(
    (state: AppState) => state.createLessonV2
  );
  const [view, setView] = useState<StepModalOptions>(stepModalOptions[0]);
  const { id } = props;

  const step: IStep | null = useMemo(() => treeSteps[id] || null, [
    id,
    treeSteps,
  ]);

  const [name, setName] = useState(step?.name || "");

  useEffect(() => {
    setName(step.name);
  }, [step]);

  const doUpdate = useCallback(
    (data: Partial<IStep>) => {
      const updatedStep = { ...treeSteps[id], ...data };
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_SETSTEP",
        arg: { step: updatedStep },
      });
      updateStep(updatedStep, id);
    },
    [id, treeSteps]
  );

  const debouncer = useDebounce(1000);

  const debounceDoUpdate = useCallback(
    (data: Partial<IStep>) => {
      debouncer(() => {
        doUpdate(data);
      });
    },
    [debouncer, doUpdate]
  );

  const callback = useCallback(
    (e) => {
      newAnchorPre(e, id);
    },
    [id]
  );

  const openAnchor = useCallback(
    (e) => {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: { currentAnchor: e },
      });
    },
    [id]
  );

  const doNameUpdate = useCallback(
    (e) => {
      debounceDoUpdate({ name: e.currentTarget.value });
      setName(e.currentTarget.value);
    },
    [debounceDoUpdate]
  );

  const [Popup, open] = usePopupImageSource(callback, true, true, true, false);

  return (
    <>
      {Popup}
      <Tabs
        buttons={stepModalOptions}
        initial={view}
        callback={setView}
        style={{ width: "-webkit-fill-available", height: "28px" }}
      />
      <TabsContainer
        style={{
          margin: "0 3px",
          padding: "10px",
          height: "200px",
          overflow: "auto",
          background: "#2e2a48",
        }}
      >
        {view === "Settings" && (
          <>
            <div>Step Settings</div>
            <BaseInput title="Step name" value={name} onChange={doNameUpdate} />
          </>
        )}
        {view === "Anchor" && (
          <>
            <Flex
              column
              style={{ height: "calc(100% - 24px)", overflow: "auto" }}
            >
              <ModalList
                options={Object.keys(treeAnchors).map((a) => treeAnchors[a])}
                current={step?.anchor || ""}
                selected={currentAnchor || ""}
                setCurrent={(val) => {
                  doUpdate({ anchor: val });
                  const prevCvResult = store.getState().render.cvResult;
                  pendingReduxAction(
                    (state) => state.render.cvResult,
                    prevCvResult
                  ).then((state) => {
                    editStepItemsRelativePosition(
                      id,
                      state.render.cvResult,
                      prevCvResult
                    );
                  });
                }}
                open={openAnchor}
              />
            </Flex>
            <div>
              <ButtonRound
                width="24px"
                height="24px"
                svg={IconAdd}
                svgStyle={{ width: "16px", height: "16px" }}
                onClick={open}
              />
            </div>
          </>
        )}
      </TabsContainer>
    </>
  );
}
