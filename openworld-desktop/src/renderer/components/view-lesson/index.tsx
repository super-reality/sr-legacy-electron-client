/* eslint-disable react/no-array-index-key */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useCallback } from "react";
import "./index.scss";
import "../popups.scss";
import { useHistory } from "react-router-dom";
import {
  ItemInner,
  Title,
  ContainerTopFace,
  ContainerFlex,
  Text,
} from "../item-inner";
import globalData from "../../globalData";
import usePopup from "../../hooks/usePopup";
import ButtonSimple from "../button-simple";
import Collapsible from "../collapsible";
import Step from "../step";
import TeacherBotLesson from "../teacherbot-lesson";
import LessonActive from "../lesson-active";
import { ILessonGet } from "../../api/types/lesson/get";

interface ViewLessonProps {
  id: string;
}

export default function ViewLesson(props: ViewLessonProps) {
  const { id } = props;
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(0);

  const data: ILessonGet = globalData.lessons[id] || undefined;
  console.log(data);
  const [Popup, open] = usePopup(false);

  const doNext = useCallback(() => {
    console.log(data.totalSteps.length, currentStep);
    if (data.totalSteps.length <= currentStep + 1) {
      return;
    }
    setCurrentStep(currentStep + 1);
  }, [currentStep]);
  const doPrev = useCallback(() => {
    console.log(data.totalSteps.length, currentStep);
    if (currentStep - 1 < 0) {
      return;
    }
    setCurrentStep(currentStep - 1);
  }, [currentStep]);
  useEffect(() => {
    if (!data) open();
  }, []);

  return (
    <>
      <Popup width="340px" height="auto">
        <div className="validation-popup">
          <div className="title red">Oops!</div>
          <div className="line">The requested lesson is not available..</div>
          <ButtonSimple
            width="140px"
            height="24px"
            margin="16px auto"
            onClick={() => history.goBack()}
          >
            Ok
          </ButtonSimple>
        </div>
      </Popup>
      {data ? (
        <>
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
          <Collapsible outer title="Lesson Info">
            <LessonActive id={id} />
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
        <></>
      )}
    </>
  );
}
