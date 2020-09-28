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
  ContainerTopBig,
} from "../item-inner";
import { Option } from "../../views/create/components";
import reduxAction from "../../redux/reduxAction";
import Category from "../../../types/collections";

interface StepProps {
  hover?: boolean;
  data: Option;
}

export default function CreateOption(props: StepProps): JSX.Element {
  const { data, hover } = props;
  const dispatch = useDispatch();
  const history = useHistory();

  const onClick = useCallback(() => {
    let type:
      | undefined
      | "CREATE_SUBJECT_DATA"
      | "CREATE_COLLECTION_DATA"
      | "CREATE_LESSON_DATA";
    if (data.category == Category.Subject) type = "CREATE_SUBJECT_DATA";
    if (data.category == Category.Collection) type = "CREATE_COLLECTION_DATA";
    if (data.category == Category.Lesson) type = "CREATE_LESSON_DATA";
    if (type) {
      reduxAction(dispatch, {
        type: type,
        arg: { _id: undefined },
      });
    }

    history.push(`/create/${data.category}`);
  }, [dispatch]);

  return (
    <ItemInner text onClick={hover ? onClick : undefined}>
      <ContainerTopBig>
        <Icon style={{ backgroundColor: "rgba(0,0,0,0)" }} url={data.image} />
        <Title title={data.title} sub={`${data.created} created`} />
        <Points points={data.cost} />
        <Text>{data.description}</Text>
      </ContainerTopBig>
    </ItemInner>
  );
}
