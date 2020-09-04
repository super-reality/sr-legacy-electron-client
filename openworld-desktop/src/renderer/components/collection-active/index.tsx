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
  ItemInnerLoader,
} from "../item-inner";
import CheckButton from "../check-button";
import ShareButton from "../share-button";
import TrashButton from "../trash-button";
import { AppState } from "../../redux/stores/renderer";
import usePopupAdd from "../../hooks/usePopupAdd";
import CollectionGet, { ICollectionGet } from "../../api/types/collection/get";
import { ISubjectGet } from "../../api/types/subject/get";
import Subject from "../subject";
import Collapsible from "../collapsible";
import useDataGet from "../../hooks/useDataGet";
import useTrashButton from "../../hooks/useTrashButton";

interface CollectionProps {
  id: string;
}

export default function Collection(props: CollectionProps): JSX.Element {
  const { id } = props;
  const [data, children] = useDataGet<
    CollectionGet,
    ICollectionGet,
    ISubjectGet
  >("collection", id);

  const checked = useSelector((state: AppState) =>
    state.userData.collections.includes(id)
  );

  const [PopupAdd, open] = usePopupAdd(checked, "collection", id);

  const [Trash, deleted] = useTrashButton("collection", data?._id);
  if (deleted) return <></>;

  return data ? (
    <>
      <ItemInner text>
        <PopupAdd />
        <ContainerTop>
          <Icon url={data.icon} />
          <Points points={0} />
          <Title title={data.name} sub={`${children?.length || 0} Subjects`} />
        </ContainerTop>
        <ContainerFlex>
          <Text>{data.description}</Text>
        </ContainerFlex>
        <ContainerFlex>
          {data.medias.map((url) => (
            <Image key={`url-image-${url}`} src={url} />
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
      <Collapsible expanded outer title="Subjects">
        {children?.map((s) => (
          <Subject key={s._id} data={s} />
        ))}
      </Collapsible>
    </>
  ) : (
    <ItemInnerLoader style={{ height: "400px" }} />
  );
}
