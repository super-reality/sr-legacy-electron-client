/* eslint-disable no-underscore-dangle */
import React, { useCallback, useState, useEffect } from "react";
import "./index.scss";
import "../popups.scss";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import {
  ItemInner,
  ItemInnerLoader,
  Icon,
  Title,
  ContainerTop,
} from "../item-inner";
import usePopupModal from "../../hooks/usePopupModal";
import CheckButton from "../check-button";
import Category from "../../../types/collections";
import { AppState } from "../../redux/stores/renderer";
import reduxAction from "../../redux/reduxAction";
import { API_URL } from "../../constants";
import LessonGet, { ILessonGet } from "../../api/types/lesson/get";
import { ApiError } from "../../api/types";
import handleLessonGet from "../../api/handleLessonGet";
import globalData from "../../globalData";

interface LessonActiveProps {
  id: string;
}

export default function LessonActive(props: LessonActiveProps) {
  const { id } = props;
  const dispatch = useDispatch();
  const checked = useSelector((state: AppState) =>
    state.userData.lessons.includes(id)
  );
  const [data, setData] = useState<ILessonGet | undefined>();
  const history = useHistory();

  const openLesson = useCallback(() => {
    history.push(`/learn/${Category.Lesson}/${id}`);
  }, []);

  const clickYes = useCallback(() => {
    reduxAction(dispatch, { type: "USERDATA_TOGGLE_LESSON", arg: id });
  }, [checked]);

  const [PopupModal, open] = usePopupModal("Add to your lessons?", clickYes);

  useEffect(() => {
    if (globalData.lessons[id]) setData(globalData.lessons[id]);
    else {
      Axios.get<LessonGet | ApiError>(`${API_URL}lesson/${id}`)
        .then(handleLessonGet)
        .then((d) => {
          globalData.lessons[id] = d;
          setData(d);
        })
        .catch(console.error);
    }
  }, []);

  return data ? (
    <ItemInner onClick={openLesson}>
      <PopupModal
        newTitle={
          checked ? "Remove from your lessons?" : "Add to your lessons?"
        }
      />
      <ContainerTop>
        <Icon url={data.icon} />
        <Title title={data.name} sub={data.shortDescription} />
        <CheckButton
          style={{ margin: "auto 4px auto auto" }}
          checked
          callback={open}
        />
      </ContainerTop>
    </ItemInner>
  ) : (
    <ItemInnerLoader />
  );
}
