/* eslint-disable react/no-array-index-key */

import React, { useState, useCallback, useEffect, useMemo } from "react";
import _ from "lodash";
import "./index.scss";
import "../popups.scss";
import { useSelector, useDispatch } from "react-redux";
import {
  ItemInner,
  Title,
  ContainerTopFace,
  ContainerFlex,
  Text,
  ItemInnerLoader,
  Image,
} from "../item-inner";
import ButtonSimple from "../button-simple";
import Collapsible from "../collapsible";
import TeacherBotLesson from "../teacherbot-lesson";
import LessonActive from "../lesson-active";
import createDetachedWindow from "../../../utils/createDetachedWindow";
import { AppState } from "../../redux/stores/renderer";
import LessonGet, { ILessonGet } from "../../api/types/lesson/get";
import isElectron from "../../../utils/electron/isElectron";
import useDataGet from "../../hooks/useDataGet";
import Step from "../step";
import reduxAction from "../../redux/reduxAction";
import Flex from "../flex";
import { InitalFnOptions } from "../../api/types/step-old/step";
import getTTS from "../../../utils/api/getTTS";
import { initialCVSettings } from "../../redux/static";

interface ViewLessonProps {
  id: string;
}

export default function ViewLesson(props: ViewLessonProps) {
  const { id } = props;
  const [data] = useDataGet<LessonGet, ILessonGet>("lesson", id);
  const dispatch = useDispatch();

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { detached } = useSelector((state: AppState) => state.commonProps);

  const stepNow = useMemo(() => data?.totalSteps[currentStep], [
    data,
    currentStep,
  ]);

  const doNext = useCallback(() => {
    if (data == undefined || data?.totalSteps.length <= currentStep + 1) return;
    setCurrentStep(currentStep + 1);
  }, [data, currentStep, stepNow]);

  const doPrev = useCallback(() => {
    if (data == undefined || currentStep - 1 < 0) return;
    setCurrentStep(currentStep - 1);
  }, [data, currentStep]);

  const openStep = useCallback(
    (i: number) => {
      reduxAction(dispatch, {
        type: "SET_YSCROLL_MOVE",
        arg: 0,
      });
      setCurrentStep(i);
    },
    [dispatch]
  );

  const clickDetach = useCallback(() => {
    createDetachedWindow(
      { width: 350, height: 400 },
      { arg: data, type: "LESSON_VIEW" }
    );
  }, [data]);

  useEffect(() => {
    if (stepNow && isPlaying) {
      reduxAction(dispatch, {
        type: "SET_CV_SETTINGS",
        arg: _.pick(stepNow, Object.keys(initialCVSettings)),
      });
      getTTS(stepNow.description, true);
    }
  }, [stepNow, isPlaying, dispatch]);

  return (
    <>
      {data && stepNow ? (
        <>
          {isPlaying == true && (
            <Collapsible outer expanded title="Step">
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
                <Flex column>
                  {stepNow.functions.map((f, i) => {
                    if (i == 0 && f == InitalFnOptions["Computer vision Off"]) {
                      return (
                        <Image
                          key={`image-${stepNow.images[i]}`}
                          src={stepNow.images[i]}
                        />
                      );
                    }
                    return (
                      <React.Fragment key={`image-${stepNow.images[i]}`} />
                    );
                  })}
                </Flex>
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
          <Collapsible
            detach={detached || !isElectron() ? undefined : clickDetach}
            outer
            title="Lesson Info"
          >
            <LessonActive id={data?._id || id} compact />
          </Collapsible>
          <Collapsible outer title="Steps">
            {data.totalSteps.map((step, i: number) => (
              <Step
                key={`step-${i}`}
                number={i + 1}
                data={step}
                onClick={() => openStep(i)}
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
