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
  ItemInnerLoader,
} from "../item-inner";
import CheckButton from "../check-button";
import ShareButton from "../share-button";
import { AppState } from "../../redux/stores/renderer";
import usePopupAdd from "../../hooks/usePopupAdd";
import SubjectGet, { ISubjectGet } from "../../api/types/subject/get";
import Collapsible from "../collapsible";
import { ILessonGet } from "../../api/types/lesson/get";
import Lesson from "../lesson";
import useDataGet from "../../hooks/useDataGet";
import useTrashButton from "../../hooks/useTrashButton";

interface SubjectActiveProps {
  id: string;
}

export default function Collection(props: SubjectActiveProps): JSX.Element {
  const { id } = props;
  const [data, children] = useDataGet<SubjectGet, ISubjectGet, ILessonGet>(
    "subject",
    id
  );
  const checked = useSelector((state: AppState) =>
    state.userData.collections.includes(id)
  );

  const [PopupAdd, open] = usePopupAdd(checked, "collection", id);

  const [Trash, deleted] = useTrashButton("subject", id);
  if (deleted) return <></>;

  return data ? (
    <>
      <ItemInner text>
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
          {data.medias.map((url) => (
            <Image key={`media-url-${url}`} src={url} />
          ))}
        </ContainerFlex>
        <ContainerBottom>
          <CheckButton
            style={{ margin: "auto" }}
            checked={checked}
            callback={open}
          />
          <div />
          <Trash />
          <ShareButton style={{ margin: "auto" }} />
        </ContainerBottom>
      </ItemInner>
      <Collapsible expanded outer title="Lessons">
        {children?.map((s) => (
          <Lesson key={s._id} data={s} />
        ))}
      </Collapsible>
    </>
  ) : (
    <ItemInnerLoader style={{ height: "400px" }} />
  );
}
