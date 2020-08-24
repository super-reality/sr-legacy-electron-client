import React from "react";

import "./index.scss";
import { ItemInner, Icon, Points, Title, Text, Image } from "../item-inner";
import { ICollection } from "../../api/types/collection/collection";

interface CollectionProps {
  data: ICollection;
}

export default function Collection(props: CollectionProps): JSX.Element {
  const { data } = props;

  return (
    <ItemInner text>
      <Icon url={data.icon} />
      <Points points={1.5} />
      <Title title={data.name} sub={`${data.subjects || 0} Subjects`} />
      <Text>
        {data.description}
        <Image src={data.medias[0]} />
      </Text>
    </ItemInner>
  );
}
