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
import SubjectGet, { ISubjectGet } from "../../api/types/subject/get";
import globalData from "../../globalData";
import { API_URL } from "../../constants";
import { ApiError } from "../../api/types";
import handleSubjectGet from "../../api/handleSubjectGet";

import Collapsible from "../collapsible";
import { ILessonGet } from "../../api/types/lesson/get";
import Lesson from "../lesson";

interface SubjectActiveProps {
  id: string;
}

export default function Collection(props: SubjectActiveProps): JSX.Element {
  const { id } = props;
  const [data, setData] = useState<ISubjectGet | undefined>();
  const [lessons, setLessons] = useState<ILessonGet[]>([]);
  const checked = useSelector((state: AppState) =>
    state.userData.collections.includes(id)
  );

  const [PopupAdd, open] = usePopupAdd(checked, "collection", id);

  useEffect(() => {
    Axios.get<SubjectGet | ApiError>(`${API_URL}subject/${id}`)
      .then(handleSubjectGet)
      .then((d) => {
        globalData.collections[id] = d.subject;
        d.lessons.forEach((lesson) => {
          globalData.subjects[lesson._id] = lesson;
        });
        setLessons(d.lessons);
        setData(d.subject);
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
          <TrashButton type="subject" id={data._id} />
          <ShareButton style={{ margin: "auto" }} />
        </ContainerBottom>
      </ItemInner>
      <Collapsible expanded outer title="Lessons">
        {lessons.map((s) => (
          <Lesson key={s._id} data={s} />
        ))}
      </Collapsible>
    </>
  ) : (
    <ItemInnerLoader style={{ height: "400px" }} />
  );
}
