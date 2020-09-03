/* eslint-disable no-underscore-dangle */
import React, { useCallback } from "react";

import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
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
import { ISubjectSearch } from "../../api/types/subject/search";
import { AppState } from "../../redux/stores/renderer";
import usePopupAdd from "../../hooks/usePopupAdd";

interface Subject {
  data: ISubjectSearch;
}

export default function Subject(props: Subject): JSX.Element {
  const { data } = props;
  const history = useHistory();
  const checked = useSelector((state: AppState) =>
    state.userData.subjects.includes(data._id)
  );

  const [PopupAdd, open] = usePopupAdd(checked, "subject", data._id);

  const doClick = useCallback(() => {
    history.push(`/discover/subject/${data._id}`);
  }, []);

  return (
    <ItemInner text onClick={doClick}>
      <PopupAdd />
      <ContainerTop>
        <Icon url={data.icon} />
        <Points points={0} />
        <Title title={data.name} sub={`${0} Lessons`} />
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
        <TrashButton type="subject" id={data._id} />
        <ShareButton style={{ margin: "auto" }} />
      </ContainerBottom>
    </ItemInner>
  );
}
