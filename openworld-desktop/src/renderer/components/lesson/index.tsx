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
import { AppState } from "../../redux/stores/renderer";
import usePopupAdd from "../../hooks/usePopupAdd";
import { ILessonSearch } from "../../api/types/lesson/search";
import useTrashButton from "../../hooks/useTrashButton";
import useEditButton from "../../hooks/useEditButton";

interface LessonProps {
  data: ILessonSearch;
}

export default function Lesson(props: LessonProps): JSX.Element {
  const { data } = props;
  const history = useHistory();
  const checked = useSelector((state: AppState) =>
    state.userData.lessons.includes(data._id)
  );

  const [PopupAdd, open] = usePopupAdd(checked, "lesson", data._id);

  const doClick = useCallback(() => {
    history.push(`/discover/lesson/${data._id}`);
  }, []);

  const EditButton = useEditButton({ type: "lesson", id: data._id });

  const [Trash, deleted] = useTrashButton("lesson", data._id);
  if (deleted) return <></>;

  return (
    <ItemInner text onClick={doClick}>
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
        <EditButton />
        <Trash />
        <ShareButton style={{ margin: "auto" }} />
      </ContainerBottom>
    </ItemInner>
  );
}
