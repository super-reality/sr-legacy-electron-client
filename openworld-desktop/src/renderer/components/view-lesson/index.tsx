/* eslint-disable react/no-array-index-key */

import React, { useState, useCallback, useEffect } from "react";
import "./index.scss";
import "../popups.scss";
import { useSelector } from "react-redux";
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
import {
  findCVArrayMatch,
  getCurrentFindWindow,
} from "../../../utils/createFindBox";
import useDataGet from "../../hooks/useDataGet";

interface ViewLessonProps {
  id: string;
}

export default function ViewLesson(props: ViewLessonProps) {
  const { id } = props;
  const [data] = useDataGet<LessonGet, ILessonGet>("lesson", id);

  const [currentStep, setCurrentStep] = useState(0);
  const { detached } = useSelector((state: AppState) => state.commonProps);

  const doNext = useCallback(() => {
    if (data == undefined) {
      return;
    }
    if (data?.totalSteps.length <= currentStep + 1) {
      return;
    }
    setCurrentStep(currentStep + 1);
  }, [currentStep]);

  const doPrev = useCallback(() => {
    if (data == undefined) {
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

  useEffect(() => {
    if (data) {
      const imageUrls = data.totalSteps[currentStep].images;
      const { functions } = data.totalSteps[currentStep];
      if (getCurrentFindWindow() != null) {
        // close current find window.
        getCurrentFindWindow().close();
      }
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
    }
  }, [currentStep]);

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
