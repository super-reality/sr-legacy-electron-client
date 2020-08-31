/* eslint-disable no-underscore-dangle */
import React, { useCallback } from "react";
import "./index.scss";
import "../popups.scss";
import { useHistory } from "react-router-dom";
import { ItemInner, Icon, Title, ContainerTop } from "../item-inner";
import usePopupModal from "../../hooks/usePopupModal";
import CheckButton from "../check-button";
import { ILesson } from "../../api/types/lesson/lesson";
import Category from "../../../types/collections";

interface LessonActiveProps {
  data: any;
}

export default function LessonActive(props: LessonActiveProps) {
  const { data } = props;
  const history = useHistory();

  const openLesson = useCallback(() => {
    history.push(`/learn/${Category.Lesson}/${data._id}`);
  }, []);

  const clickYes = useCallback(() => {
    console.log("You clicked yes!");
  }, []);

  const [PopupModal, open] = usePopupModal("Add to your lessons?", clickYes);

  return (
    <ItemInner onClick={openLesson}>
      <PopupModal />
      <ContainerTop>
        <Icon url={data.icon} />
        <Title title={data.name} sub={data.shortDescription} />
        <CheckButton
          style={{ margin: "auto 4px auto auto" }}
          checked
          callback={open}
        />
      </ContainerTop>
    </ItemInner>
  );
}
