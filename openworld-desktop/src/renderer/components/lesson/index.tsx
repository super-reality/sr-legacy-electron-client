/* eslint-disable no-underscore-dangle */
import React, { useCallback } from "react";

import "./index.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  ItemInner,
  Icon,
  Points,
  Title,
  Text,
  Image,
  ContainerTop,
  ContainerFlex,
  ContainerBottom,
} from "../item-inner";
import CheckButton from "../check-button";
import usePopupModal from "../../hooks/usePopupModal";
import ShareButton from "../share-button";
import { ILessonSearch } from "../../api/types/lesson/search";
import reduxAction from "../../redux/reduxAction";
import { AppState } from "../../redux/stores/renderer";

interface LessonProps {
  data: ILessonSearch;
}

export default function Lesson(props: LessonProps): JSX.Element {
  const { data } = props;
  const dispatch = useDispatch();
  const checked = useSelector((state: AppState) =>
    state.userData.lessons.includes(data._id)
  );

  const clickYes = useCallback(() => {
    reduxAction(dispatch, { type: "USERDATA_TOGGLE_LESSON", arg: data._id });
  }, [checked]);

  const [PopupModal, open] = usePopupModal("", clickYes);

  return (
    <ItemInner text>
      <PopupModal
        newTitle={
          checked ? "Remove from your lessons?" : "Add to your lessons?"
        }
      />
      <ContainerTop>
        <Icon url={data.icon} />
        <Points points={data.rating} />
        <Title title={data.name} sub={`${data.totalSteps.length} Steps`} />
      </ContainerTop>
      <ContainerFlex>
        <Text>{data.description}</Text>
      </ContainerFlex>
      <ContainerFlex>
        <Image src={data.medias[0]} />
      </ContainerFlex>
      <ContainerBottom>
        <CheckButton
          style={{ margin: "auto" }}
          checked={checked}
          callback={open}
        />
        <div />
        <ShareButton style={{ margin: "auto" }} />
      </ContainerBottom>
    </ItemInner>
  );
}
