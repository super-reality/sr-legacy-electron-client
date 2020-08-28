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
import CollectionCreate from "../../../api/types/collection/create";
import handleCollectionCreate from "../../../api/handleCollectionCreate";
import { EntryOptions } from "../../../api/types/lesson/lesson";
import constantFormat from "../../../../utils/constantFormat";
import BaseSelect from "../../base-select";
import { ICollection } from "../../../api/types/collection/collection";
import setLoading from "../../../redux/utils/setLoading";
import usePopupValidation from "../../../hooks/usePopupValidation";
import uploadMany from "../../../../utils/uploadMany";

const uploadArtifacts = (original: ICollection) => {
  const fileNames = [];
  fileNames.push(original.icon);
  original.medias.forEach((mediaPath) => fileNames.push(mediaPath));
  return uploadMany(fileNames);
};

const preprocessDataBeforePost = (
  postData: ICollection,
  artifacts: Record<string, string>
): ICollection => {
  return {
    ...postData,
    icon: artifacts[postData.icon],
    medias: postData.medias.map((item: string) => {
      return artifacts[item];
    }),
  };
};

export default function PublishAuthoring(): JSX.Element {
  const dispatch = useDispatch();
  const { entry } = useSelector((state: AppState) => state.createCollection);
  const finalData = useSelector((state: AppState) => state.createCollection);
  const [creationState, setCreationState] = useState(true);

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
    setLoading(true);
    if (reasons.length == 0) {
      uploadArtifacts(finalData)
        .then((artifacts) =>
          axios.post<CollectionCreate | ApiError>(
            `${API_URL}collection/create`,
            preprocessDataBeforePost(finalData, artifacts)
          )
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
      <ValidationPopup sucess={creationState} validationFn={validateFields} />
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
