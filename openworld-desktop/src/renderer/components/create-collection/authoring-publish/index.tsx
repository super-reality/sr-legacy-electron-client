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
import uploadFileToS3 from "../../../../utils/uploadFileToS3";
import constantFormat from "../../../../utils/constantFormat";
import BaseSelect from "../../base-select";
import { ICollection } from "../../../api/types/collection/collection";
import getFileExt from "../../../../utils/getFileExt";
import getFileSha1 from "../../../../utils/getFileSha1";

const uploadArtifacts = (original: ICollection): Promise<string[]> => {
  const fileNames = [];
  const iconPath = original.icon.split('"').join("");
  fileNames.push(iconPath);
  original.medias.forEach((mediaPath) => fileNames.push(mediaPath));
  return Promise.all(fileNames.map((file) => uploadFileToS3(file)));
};

const preprocessDataBeforePost = (postData: ICollection): ICollection => {
  const localData = { ...postData };
  const icon = getFileSha1(localData.icon) + getFileExt(localData.icon);
  const medias = localData.medias.map((item: string) => {
    return getFileSha1(item) + getFileExt(item);
  });
  return { ...localData, icon, medias };
};

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

  const doPublish = useCallback(() => {
    const reasons = validateFields();
    reduxAction(dispatch, { type: "SET_LOADING_STATE", arg: true });
    if (reasons.length == 0) {
      const dataPost = preprocessDataBeforePost(finalData);
      uploadArtifacts(finalData)
        .then(() =>
          axios.post<CollectionCreate | ApiError>(
            `${API_URL}collection/create`,
            dataPost
          )
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
          onClick={doPublish}
        >
          Publish
        </ButtonSimple>
      </Flex>
    </>
  );
}
