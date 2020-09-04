/* eslint-disable react/no-array-index-key */

import React, { useState, useCallback, useEffect } from "react";
import "./index.scss";
import "../popups.scss";
import { useSelector } from "react-redux";
import { findAllByTestId } from "@testing-library/react";
import {
  ItemInner,
  Title,
  ContainerTopFace,
  ContainerFlex,
  Text,
  ItemInnerLoader,
} from "../item-inner";
import ButtonSimple from "../button-simple";
import Collapsible from "../collapsible";
import Step from "../step";
import TeacherBotLesson from "../teacherbot-lesson";
import LessonActive from "../lesson-active";
import createDetachedWindow from "../../../utils/createDetachedWindow";
import { AppState } from "../../redux/stores/renderer";
import LessonGet, { ILessonGet } from "../../api/types/lesson/get";
import isElectron from "../../../utils/isElectron";
import useDataGet from "../../hooks/useDataGet";
import {
  findCVArrayMatch,
  getCurrentFindWindow,
} from "../../../utils/createFindBox";
import jsonRpcRemote from "../../../utils/jsonRpcSend";
import usePopup from "../../hooks/usePopup";

interface ViewLessonProps {
  id: string;
}

export default function ViewLesson(props: ViewLessonProps) {
  const { id } = props;
  const [data] = useDataGet<LessonGet, ILessonGet>("lesson", id);

  const [currentStep, setCurrentStep] = useState(0);
  const [onProcessing, setOnProcessing] = useState<boolean>(false);
  const { detached } = useSelector((state: AppState) => state.commonProps);

  const doNext = useCallback(() => {
    if (data == undefined || onProcessing) {
      return;
    }
    if (data?.totalSteps.length <= currentStep + 1) {
      return;
    }
    setCurrentStep(currentStep + 1);
  }, [currentStep]);

  const doPrev = useCallback(() => {
    if (data == undefined || onProcessing) {
      return;
    }
    if (currentStep - 1 < 0) {
      return;
    }
    setCurrentStep(currentStep - 1);
  }, [currentStep]);

  const clickDetach = useCallback(() => {
    createDetachedWindow(
      { width: 350, height: 400 },
      { arg: data, type: "LESSON_VIEW" }
    );
  }, []);

  const [Popup, open] = usePopup(false);

  useEffect(() => {
    if (data && onProcessing == false) {
      setOnProcessing(true);
      if (getCurrentFindWindow() != null) {
        let findWin = getCurrentFindWindow();
        findWin.close();
        findWin = null;
      }
      const imageUrls = data.totalSteps[currentStep].images;
      const { functions } = data.totalSteps[currentStep];
      const playText = data.totalSteps[currentStep].description;

      findCVArrayMatch(imageUrls, functions)
        .then((res) => {
          if (res) {
            console.log("match exists");
          } else {
            console.log("match failed");
          }
        })
        .catch((err) => {
          console.log(err);
        });
      jsonRpcRemote("TTS", { text: playText })
        .then((res) => {
          console.log("playing nice");
          setOnProcessing(false);
        })
        .catch((err) => {
          console.log("error occured while playing");
          setOnProcessing(false);
        });
    }
    if (!data) open();
  }, [onProcessing, currentStep]);

  return (
    <>
      {data ? (
        <>
          <Collapsible
            outer
            expanded
            detach={detached || !isElectron() ? undefined : clickDetach}
            title="Step"
          >
            <ItemInner>
              <ContainerTopFace>
                <TeacherBotLesson />
                <Title
                  style={{ marginTop: "2px", justifyContent: "initial" }}
                  title={data.totalSteps[currentStep].name}
                  sub={`Step ${currentStep + 1}`}
                />
              </ContainerTopFace>
              <ContainerFlex>
                <Text>{data.totalSteps[currentStep].description}</Text>
              </ContainerFlex>
              <ContainerFlex style={{ justifyContent: "space-around" }}>
                <ButtonSimple width="120px" height="16px" onClick={doPrev}>
                  Prev
                </ButtonSimple>
                <ButtonSimple width="120px" height="16px" onClick={doNext}>
                  Next
                </ButtonSimple>
              </ContainerFlex>
            </ItemInner>
          </Collapsible>
          <Collapsible outer title="Lesson Info">
            <LessonActive id={data?._id || id} compact />
          </Collapsible>
          <Collapsible outer title="Steps">
            {data.totalSteps.map((step, i: number) => (
              <Step
                key={`step-${i}`}
                number={i + 1}
                data={step}
                drag={false}
                style={{ margin: "5px 10px", height: "auto" }}
              />
            ))}
          </Collapsible>
        </>
      ) : (
        <ItemInnerLoader style={{ height: "400px" }} />
      )}
    </>
  );
}
