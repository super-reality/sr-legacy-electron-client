import React, { useState, useCallback } from "react";

import "./index.scss";
import { method } from "lodash";
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
} from "../item-inner";
import { ICollection } from "../../api/types/collection/collection";
import CheckButton from "../check-button";
import usePopupModal from "../../hooks/usePopupModal";
import ShareButton from "../share-button";
import createFindBox, { findCVMatch } from "../../../utils/createFindBox";
import jsonRpcRemote from "../../../utils/jsonRpcSend";

const { remote } = require("electron");

interface CollectionProps {
  data: ICollection;
}

export default function Collection(props: CollectionProps): JSX.Element {
  const [checked, setChecked] = useState(false);
  const { data } = props;

  const clickYes = useCallback(() => {
    setChecked(!checked);
  }, [checked]);

  const onClick = useCallback(() => {
    findCVMatch(data.medias[0])
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [PopupModal, open] = usePopupModal("", clickYes);

  return (
    <ItemInner text>
      <PopupModal
        newTitle={
          checked ? "Remove from your collections?" : "Add to your collections?"
        }
      />
      <ContainerTop>
        <Icon url={data.icon} />
        <Points points={1.5} />
        <Title title={data.name} sub={`${data.subjects || 0} Subjects`} />
      </ContainerTop>
      <ContainerFlex>
        <Text>{data.description}</Text>
      </ContainerFlex>
      <ContainerFlex>
        <Image src={data.medias[0]} onClick={onClick} />
      </ContainerFlex>
      <ContainerBottom>
        <CheckButton
          style={{ margin: "auto" }}
          checked={checked}
          callback={open}
        />
        <div />
        <ShareButton style={{ margin: "auto" }} />
      </ContainerBottom>
    </ItemInner>
  );
}
