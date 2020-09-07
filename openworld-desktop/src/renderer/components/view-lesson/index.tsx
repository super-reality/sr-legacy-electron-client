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

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [onProcessing, setOnProcessing] = useState<boolean>(false);
  const { detached } = useSelector((state: AppState) => state.commonProps);

  const stepNow = data?.totalSteps[currentStep];

  const doStart = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const doNext = useCallback(() => {
    if (
      data == undefined ||
      onProcessing ||
      data?.totalSteps.length <= currentStep + 1
    )
      return;
    setCurrentStep(currentStep + 1);
  }, [currentStep]);

  const doPrev = useCallback(() => {
    if (data == undefined || onProcessing || currentStep - 1 < 0) return;
    setCurrentStep(currentStep - 1);
  }, [currentStep]);

  const clickDetach = useCallback(() => {
    createDetachedWindow(
      { width: 350, height: 400 },
      { arg: data, type: "LESSON_VIEW" }
    );
  }, []);

  useEffect(() => {
    if (data && stepNow && onProcessing == false) {
      // setOnProcessing(true);
      if (getCurrentFindWindow() != null) {
        let findWin = getCurrentFindWindow();
        findWin.close();
        findWin = null;
      }
      const { functions, images, description } = stepNow;

      findCVArrayMatch(images, functions)
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
      /*
      jsonRpcRemote("TTS", { text: description })
        .then((res) => {
          console.log("playing nice");
          setOnProcessing(false);
        })
        .catch((err) => {
          console.log("error occured while playing");
          setOnProcessing(false);
        });
      */
    }
  }, [onProcessing, currentStep]);

  return (
    <>
      {data && stepNow ? (
        <>
          {isPlaying == true && (
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
                    title={stepNow.name}
                    sub={`Step ${currentStep + 1}`}
                  />
                </ContainerTopFace>
                <ContainerFlex>
                  <Text>{stepNow.description}</Text>
                </ContainerFlex>
                <ContainerFlex style={{ justifyContent: "space-around" }}>
                  {currentStep > 0 && (
                    <ButtonSimple width="120px" height="16px" onClick={doPrev}>
                      Prev
                    </ButtonSimple>
                  )}
                  <ButtonSimple width="120px" height="16px" onClick={doNext}>
                    Next
                  </ButtonSimple>
                </ContainerFlex>
              </ItemInner>
            </Collapsible>
          )}
          <Collapsible outer title="Lesson Info">
            <LessonActive id={data?._id || id} compact />
            {isPlaying == false && (
              <ButtonSimple
                width="120px"
                height="16px"
                margin="8px auto"
                onClick={doStart}
              >
                Start Lesson
              </ButtonSimple>
            )}
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
