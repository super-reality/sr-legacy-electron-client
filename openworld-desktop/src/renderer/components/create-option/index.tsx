import React, { useCallback } from "react";

import "./index.scss";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  ItemInner,
  Icon,
  Title,
  Text,
  Points,
  ContainerTop,
  ContainerFlex,
} from "../item-inner";
import { Option } from "../../views/create/components";

interface StepProps {
  hover?: boolean;
  data: Option;
}

export default function CreateOption(props: StepProps): JSX.Element {
  const { data, hover } = props;
  const dispatch = useDispatch();
  const history = useHistory();

  const onClick = useCallback(() => history.push(`/create/${data.category}`), [
    dispatch,
  ]);

  return (
    <ItemInner text onClick={hover ? onClick : undefined}>
      <ContainerTop>
        <Icon style={{ backgroundColor: "rgba(0,0,0,0)" }} url={data.image} />
        <Title title={data.title} sub={`${data.created} created`} />
        <Points points={data.cost} />
      </ContainerTop>
      <ContainerFlex>
        <Text>{data.description}</Text>
      </ContainerFlex>
    </ItemInner>
  );
}
