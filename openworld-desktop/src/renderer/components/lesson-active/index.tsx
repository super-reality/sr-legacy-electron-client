/* eslint-disable react/no-array-index-key */

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
import Collapsible from "../collapsible";
import LessonGet, { ILessonGet } from "../../api/types/lesson/get";
import Step from "../step";
import useDataGet from "../../hooks/useDataGet";
import useTrashButton from "../../hooks/useTrashButton";

interface LessonActiveProps {
  id: string;
  compact?: boolean;
}

export default function LessonActive(props: LessonActiveProps): JSX.Element {
  const { id, compact } = props;
  const [data] = useDataGet<LessonGet, ILessonGet>("lesson", id);
  const checked = useSelector((state: AppState) =>
    state.userData.lessons.includes(id)
  );

  const [PopupAdd, open] = usePopupAdd(checked, "lesson", id);

  const [Trash, deleted] = useTrashButton("collection", id);
  if (deleted) return <></>;

  return data ? (
    <>
      <ItemInner text>
        <PopupAdd />
        <ContainerTop>
          <Icon url={data.icon} />
          <Points points={0} />
          <Title title={data.name} sub={`${data.totalSteps.length} Steps`} />
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
      {compact ? (
        <></>
      ) : (
        <Collapsible expanded outer title="Subjects">
          {data.totalSteps.map((step, i: number) => (
            <Step
              key={`step-${i}`}
              number={i + 1}
              data={step}
              drag={false}
              style={{ margin: "5px 10px", height: "auto" }}
            />
          ))}
        </Collapsible>
      )}
    </>
  ) : (
    <ItemInnerLoader style={{ height: "400px" }} />
  );
}
