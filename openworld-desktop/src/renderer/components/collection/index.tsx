import React from "react";

import "./index.scss";
import {
  ItemInner,
  Icon,
  Points,
  Title,
  Text,
  Image,
  ContainerTop,
  ContainerFlex,
} from "../item-inner";
import { ICollection } from "../../api/types/collection/collection";

interface CollectionProps {
  data: ICollection;
}

export default function Collection(props: CollectionProps): JSX.Element {
  const { data } = props;

  return (
    <ItemInner text>
      <ContainerTop>
        <Icon url={data.icon} />
        <Points points={1.5} />
        <Title title={data.name} sub={`${data.subjects || 0} Subjects`} />
      </ContainerTop>
      <ContainerFlex>
        <Text>{data.description}</Text>
      </ContainerFlex>
      <ContainerFlex>
        <Image src={data.medias[0]} />
      </ContainerFlex>
    </ItemInner>
  );
}
