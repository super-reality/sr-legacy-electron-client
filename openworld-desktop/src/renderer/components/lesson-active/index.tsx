import React, { useCallback, useState } from "react";
import "./index.scss";
import "../popups.scss";
import { ItemInner, Icon, Title, Social, ContainerTop } from "../item-inner";
import { ILessonData } from "../../../types/api";
import usePopupModal from "../../hooks/usePopupModal";
import CheckButton from "../check-button";

interface LessonActiveProps {
  data: ILessonData;
}

export default function LessonActive(props: LessonActiveProps) {
  const { data } = props;

  const clickYes = useCallback(() => {
    console.log("You clicked yes!");
  }, []);

  const [PopupModal, open] = usePopupModal("Add to your lessons?", clickYes);

  return (
    <ItemInner>
      <PopupModal />
      <ContainerTop>
        <Icon url={data.avatarUrl} />
        <Title title={data.name} sub={data.creator} />
        <CheckButton
          style={{ margin: "auto 4px auto auto" }}
          checked
          callback={open}
        />
      </ContainerTop>
    </ItemInner>
  );
}
