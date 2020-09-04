/* eslint-disable react/no-array-index-key */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useCallback } from "react";
import "./index.scss";
import "../popups.scss";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import Axios from "axios";
import {
  ItemInner,
  Title,
  ContainerTopFace,
  ContainerFlex,
  Text,
  ItemInnerLoader,
} from "../item-inner";
import globalData from "../../globalData";
import ButtonSimple from "../button-simple";
import Collapsible from "../collapsible";
import Step from "../step";
import TeacherBotLesson from "../teacherbot-lesson";
import LessonActive from "../lesson-active";
import createDetachedWindow from "../../../utils/createDetachedWindow";
import { AppState } from "../../redux/stores/renderer";
import LessonGet, { ILessonGet } from "../../api/types/lesson/get";
import isElectron from "../../../utils/isElectron";
import handleLessonGet from "../../api/handleLessonGet";
import { API_URL } from "../../constants";
import { ApiError } from "../../api/types";

interface ViewLessonProps {
  id: string;
}

export default function ViewLesson(props: ViewLessonProps) {
  const { id } = props;
  const [data, setData] = useState<ILessonGet | undefined>(
    globalData.lessons[id] || undefined
  );
  const [currentStep, setCurrentStep] = useState(0);
  const { detached } = useSelector((state: AppState) => state.commonProps);

  const doNext = useCallback(() => {
    setCurrentStep(currentStep + 1);
  }, [currentStep]);

  const clickDetach = useCallback(() => {
    createDetachedWindow(
      { width: 350, height: 400 },
      { arg: data, type: "LESSON_VIEW" }
    );
  }, []);

  useEffect(() => {
    Axios.get<LessonGet | ApiError>(`${API_URL}lesson/${id}`)
      .then(handleLessonGet)
      .then((d) => {
        globalData.lessons[id] = d.lesson;
        setData(d.lesson);
      })
      .catch(console.error);
  }, []);

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
              <ContainerFlex>
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
