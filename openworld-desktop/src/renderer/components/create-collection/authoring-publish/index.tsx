import React, { useCallback, useState } from "react";
import "../../containers.scss";
import "../../popups.scss";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Flex from "../../flex";
import ButtonSimple from "../../button-simple";
import { AppState } from "../../../redux/stores/renderer";
import reduxAction from "../../../redux/reduxAction";
import { API_URL } from "../../../constants";
import handleGenericError from "../../../api/handleGenericError";
import useTagsBox, { ITag } from "../../tag-box";
import handleCollectionCreate from "../../../api/handleCollectionCreate";
import { EntryOptions } from "../../../api/types/lesson/lesson";
import constantFormat from "../../../../utils/constantFormat";
import BaseSelect from "../../base-select";
import { ICollection } from "../../../api/types/collection/collection";
import setLoading from "../../../redux/utils/setLoading";
import usePopupValidation from "../../../hooks/usePopupValidation";
import uploadMany from "../../../../utils/uploadMany";
import makeValidation, {
  ValidationFields,
} from "../../../../utils/makeValidation";
import ITagToString from "../../../../utils/ITagToString";

const uploadArtifacts = (original: ICollection) => {
  const fileNames = [];
  fileNames.push(original.icon);
  original.medias.forEach((mediaPath) => fileNames.push(mediaPath));
  return uploadMany(fileNames);
};

const preprocessDataBeforePost = (
  postData: ICollection,
  artifacts: Record<string, string>
): any => {
  return {
    ...postData,
    icon: artifacts[postData.icon],
    tags: ITagToString(postData.tags),
    medias: postData.medias.map((item: string) => {
      return artifacts[item];
    }),
  };
};

export default function PublishAuthoring(): JSX.Element {
  const dispatch = useDispatch();
  const entry = useSelector((state: AppState) => state.createCollection.entry);
  const tags = useSelector((state: AppState) => state.createCollection.tags);
  const finalData = useSelector((state: AppState) => state.createCollection);
  const [creationState, setCreationState] = useState(true);

  const isEditing = finalData._id !== undefined;

  const setEntry = useCallback(
    (_entry: number) => {
      reduxAction(dispatch, {
        type: "CREATE_COLLECTION_DATA",
        arg: { entry: _entry },
      });
    },
    [dispatch]
  );

  const [ValidationPopup, open] = usePopupValidation("collection");

  const validateFields = useCallback(() => {
    const validation: ValidationFields<ICollection> = {
      name: { name: "Title", minLength: 4 },
      description: { name: "Description", minLength: 4 },
      shortDescription: { name: "Short description", minLength: 4 },
      icon: { name: "Icon", minLength: 4 },
      medias: { name: "Media", minItems: 0 },
    };
    return makeValidation<ICollection>(validation, finalData);
  }, [finalData]);

  const doPublish = useCallback(() => {
    const reasons = validateFields();
    setLoading(true);
    if (reasons.length == 0) {
      uploadArtifacts(finalData)
        .then((artifacts) =>
          axios({
            method: isEditing ? "PUT" : "POST",
            url: `${API_URL}collection/${isEditing ? "update" : "create"}`,
            data: preprocessDataBeforePost(finalData, artifacts),
          })
        )
        .then(handleCollectionCreate)
        .then(() => {
          setLoading(false);
          setCreationState(true);
          open();
        })
        .catch((err) => {
          setLoading(false);
          setCreationState(false);
          open();
          handleGenericError(err);
        });
    } else {
      setLoading(false);
      setCreationState(false);
      open();
    }
  }, [open, finalData]);

  const addTag = useCallback(
    (tag: ITag) => {
      reduxAction(dispatch, {
        type: "CREATE_COLLECTION_DATA",
        arg: { tags: [...tags, tag] },
      });
    },
    [dispatch, tags]
  );

  const removeTag = useCallback(
    (index: number) => {
      const newArr = [...tags];
      newArr.splice(index, 1);
      reduxAction(dispatch, {
        type: "CREATE_COLLECTION_DATA",
        arg: { tags: newArr },
      });
    },
    [dispatch, tags]
  );

  const TagsBox = useTagsBox(tags, addTag, removeTag, true);

  return (
    <>
      <ValidationPopup
        sucess={creationState}
        validationFn={validateFields}
        edit={isEditing}
      />
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
          {TagsBox}
        </div>
      </Flex>
      <Flex style={{ marginTop: "8px" }}>
        <ButtonSimple
          margin="8px auto"
          width="200px"
          height="24px"
          onClick={doPublish}
        >
          {isEditing ? "Edit" : "Publish"}
        </ButtonSimple>
      </Flex>
    </>
  );
}
