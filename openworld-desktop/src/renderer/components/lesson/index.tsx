/* eslint-disable no-underscore-dangle */
import React from "react";

import { useSelector } from "react-redux";
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
import ShareButton from "../share-button";
import TrashButton from "../trash-button";
import { ILessonSearch } from "../../api/types/lesson/search";
import { AppState } from "../../redux/stores/renderer";
import usePopupAdd from "../../hooks/usePopupAdd";

interface LessonProps {
  data: ILessonSearch;
}

export default function Lesson(props: LessonProps): JSX.Element {
  const { data } = props;
  const checked = useSelector((state: AppState) =>
    state.userData.lessons.includes(data._id)
  );

  const [PopupAdd, open] = usePopupAdd(checked, "lesson", data._id);

  return (
    <ItemInner text>
      <PopupAdd />
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
        <TrashButton type="lesson" id={data._id} />
        <ShareButton style={{ margin: "auto" }} />
      </ContainerBottom>
    </ItemInner>
  );
}
