import React, { useCallback, useState, useEffect } from "react";
import "../../containers.scss";
import "../../popups.scss";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Flex from "../../flex";
import ButtonSimple from "../../button-simple";
import { AppState } from "../../../redux/stores/renderer";
import reduxAction from "../../../redux/reduxAction";
import { API_URL } from "../../../constants";
import { ApiError } from "../../../api/types";
import handleGenericError from "../../../api/handleGenericError";
import useTagsBox from "../../tag-box";
import usePopup from "../../../hooks/usePopup";
import CollectionCreate from "../../../api/types/collection/create";
import handleCollectionCreate from "../../../api/handleCollectionCreate";
import { EntryOptions } from "../../../api/types/lesson/lesson";
import constantFormat from "../../../../utils/constantFormat";
import BaseSelect from "../../base-select";

export default function PublishAuthoring(): JSX.Element {
  const dispatch = useDispatch();
  const { entry } = useSelector((state: AppState) => state.createCollection);
  const finalData = useSelector((state: AppState) => state.createCollection);

  const setEntry = useCallback(
    (_entry: number) => {
      reduxAction(dispatch, {
        type: "CREATE_COLLECTION_DATA",
        arg: { entry: _entry },
      });
    },
    [dispatch]
  );

  const [Popup, open, closePopup] = usePopup(false);

  const validateFields = useCallback(() => {
    const reasons: string[] = [];
    if (finalData.name.length == 0) reasons.push("Title is required");
    else if (finalData.name.length < 4) reasons.push("Title is too short");

    if (finalData.description.length == 0)
      reasons.push("Description is required");
    else if (finalData.description.length < 10)
      reasons.push("Description is too short");

    if (finalData.shortDescription.length == 0)
      reasons.push("Short description is required");
    else if (finalData.shortDescription.length < 5)
      reasons.push("Short description is too short");

    if (finalData.icon == "") reasons.push("Icon is required");
    if (finalData.medias.length == 0) reasons.push("Media is required");

    return reasons;
  }, [finalData]);

  const lessonPublish = useCallback(() => {
    const reasons = validateFields();
    if (reasons.length == 0) {
      axios
        .post<CollectionCreate | ApiError>(
          `${API_URL}collection/create`,
          finalData
        )
        .then(handleCollectionCreate)
        .catch(handleGenericError);
    } else {
      open();
    }
  }, [open, finalData]);

  const [TagsBox, addTag, getTags] = useTagsBox([], true);

  useEffect(() => {
    const tagsList: string[] = getTags().map((t) => t.name);
    reduxAction(dispatch, {
      type: "CREATE_COLLECTION_DATA",
      arg: { tags: tagsList },
    });
  }, [getTags]);

  return (
    <>
      <Popup width="400px" height="auto">
        <div className="validation-popup">
          <div className="title">Please review before publishing:</div>
          {validateFields().map((r) => (
            <div className="line" key={r}>
              {r}
            </div>
          ))}
          <ButtonSimple className="button" onClick={closePopup}>
            Ok
          </ButtonSimple>
        </div>
      </Popup>
      <BaseSelect
        title="Entry"
        current={entry}
        options={Object.values(EntryOptions)}
        optionFormatter={constantFormat(EntryOptions)}
        callback={setEntry}
      />
      <Flex>
        <div className="container-with-desc">
          <div>Tags</div>
          <TagsBox />
        </div>
      </Flex>
      <Flex style={{ marginTop: "8px" }}>
        <ButtonSimple
          margin="8px auto"
          width="200px"
          height="24px"
          onClick={lessonPublish}
        >
          Publish
        </ButtonSimple>
      </Flex>
    </>
  );
}
