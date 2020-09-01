/* eslint-disable react/no-array-index-key */
/* eslint-disable no-underscore-dangle */
import React, { useCallback, useState, useEffect } from "react";
import "./index.scss";
import "../popups.scss";
import { useHistory } from "react-router-dom";
import {
  ItemInner,
  Icon,
  Title,
  Social,
  ContainerTop,
  ContainerFlex,
  Text,
} from "../item-inner";
import usePopupModal from "../../hooks/usePopupModal";
import CheckButton from "../check-button";
import { ILesson } from "../../api/types/lesson/lesson";
import Category from "../../../types/collections";
import globalData from "../../globalData";
import usePopup from "../../hooks/usePopup";
import ButtonSimple from "../button-simple";
import Tests from "../../views/tests";
import Collapsible from "../collapsible";
import Step from "../step";

interface LessonActiveProps {
  id: string;
}

export default function ViewLesson(props: LessonActiveProps) {
  const { id } = props;
  const history = useHistory();

  const data = globalData.lessons[id] || undefined;

  const [Popup, open] = usePopup(false);

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
            <ContainerTop>
              <Icon url={data.icon} />
              <Title title={data.name} sub={data.shortDescription} />
            </ContainerTop>
            <ContainerFlex>
              <Text>{data.description}</Text>
            </ContainerFlex>
          </ItemInner>
          <Collapsible outer title="Steps">
            {data.steps.map((step: any, i: number) => (
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
