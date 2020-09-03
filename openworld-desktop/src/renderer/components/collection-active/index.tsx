/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import Axios from "axios";
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
import globalData from "../../globalData";
import { API_URL } from "../../constants";
import { ApiError } from "../../api/types";
import handleCollectionGet from "../../api/handleCollectionGet";
import { ISubjectGet } from "../../api/types/subject/get";
import Subject from "../subject";
import Collapsible from "../collapsible";

interface CollectionProps {
  id: string;
}

export default function Collection(props: CollectionProps): JSX.Element {
  const { id } = props;
  const [data, setData] = useState<ICollectionGet | undefined>();
  const [subjects, setSubjects] = useState<ISubjectGet[]>([]);
  const checked = useSelector((state: AppState) =>
    state.userData.collections.includes(id)
  );

  const [PopupAdd, open] = usePopupAdd(checked, "collection", id);

  useEffect(() => {
    Axios.get<CollectionGet | ApiError>(`${API_URL}collection/${id}`)
      .then(handleCollectionGet)
      .then((d) => {
        globalData.collections[id] = d.collection;
        d.subjects.forEach((subject) => {
          globalData.subjects[subject._id] = subject;
        });
        setSubjects(d.subjects);
        setData(d.collection);
      })
      .catch(console.error);
  }, []);

  return data ? (
    <>
      <ItemInner text>
        <PopupAdd />
        <ContainerTop>
          <Icon url={data.icon} />
          <Points points={0} />
          <Title title={data.name} sub={`${subjects.length} Subjects`} />
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
          <TrashButton type="collection" id={data._id} />
          <ShareButton style={{ margin: "auto" }} />
        </ContainerBottom>
      </ItemInner>
      <Collapsible expanded outer title="Subjects">
        {subjects.map((s) => (
          <Subject key={s._id} data={s} />
        ))}
      </Collapsible>
    </>
  ) : (
    <ItemInnerLoader style={{ height: "400px" }} />
  );
}
