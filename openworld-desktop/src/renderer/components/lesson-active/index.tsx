import React from "react";
import "./index.scss";
import { ItemInner, Icon, Title, Social } from "../item-inner";
import { ILessonData } from "../../../types/api";

interface LessonActiveProps {
  data: ILessonData;
}

export default function LessonActive(props: LessonActiveProps) {
  const { data } = props;
  return (
    <ItemInner>
      <Icon url={data.avatarUrl} />
      <Title title={data.name} sub={data.creator} />
      <Social rating={data.rating} share="http://someurl.com" checked />
    </ItemInner>
  );
}
