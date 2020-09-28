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
import useTagsBox, { ITag } from "../../tag-box";
import handleSubjectSearchParent from "../../../api/handleSubjectSearchParent";
import { EntryOptions } from "../../../api/types/lesson/lesson";
import constantFormat from "../../../../utils/constantFormat";
import BaseSelect from "../../base-select";
import { getParentVal, getParentId, renderParent } from "../../links";
import { Parents } from "../../../api/types/lesson/search-parent";
import AutosuggestInput from "../../autosuggest-input";
import handleSubjectCreate from "../../../api/handleSubjectCreate";
import SubjectSearchParent from "../../../api/types/subject/search-parent";
import { ISubject } from "../../../api/types/subject/subject";
import setLoading from "../../../redux/utils/setLoading";
import usePopupValidation from "../../../hooks/usePopupValidation";
import uploadMany from "../../../../utils/uploadMany";
import makeValidation, {
  ValidationFields,
} from "../../../../utils/makeValidation";
import ITagToString from "../../../../utils/ITagToString";
import ITagToLink from "../../../../utils/ITagToLink";

const uploadArtifacts = (original: ISubject) => {
  const fileNames = [];
  fileNames.push(original.icon);
  original.medias.forEach((mediaPath) => fileNames.push(mediaPath));
  return uploadMany(fileNames);
};

const preprocessDataBeforePost = (
  postData: ISubject,
  artifacts: Record<string, string>
): any => {
  return {
    ...postData,
    icon: artifacts[postData.icon],
    tags: ITagToString(postData.tags),
    parent: ITagToLink(postData.parent),
    medias: postData.medias.map((item: string) => {
      return artifacts[item];
    }),
  };
};

export default function PublishAuthoring(): JSX.Element {
  const dispatch = useDispatch();
  const [suggestions, setSuggestions] = useState<Parents[]>([]);
  const entry = useSelector((state: AppState) => state.createSubject.entry);
  const tags = useSelector((state: AppState) => state.createSubject.tags);
  const parent = useSelector((state: AppState) => state.createSubject.parent);
  const finalData = useSelector((state: AppState) => state.createSubject);
  const [creationState, setCreationState] = useState(true);

  const isEditing = finalData._id !== undefined;

  const setEntry = useCallback(
    (_entry: number) => {
      reduxAction(dispatch, {
        type: "CREATE_SUBJECT_DATA",
        arg: { entry: _entry },
      });
    },
    [dispatch]
  );

  const [ValidationPopup, open] = usePopupValidation("subject");

  const validateFields = useCallback(() => {
    const validation: ValidationFields<ISubject> = {
      name: { name: "Title", minLength: 4 },
      description: { name: "Description", minLength: 4 },
      shortDescription: { name: "Short description", minLength: 4 },
      icon: { name: "Icon", minLength: 4 },
      medias: { name: "Media", minItems: 1 },
      parent: { name: "Parent Collections", minItems: 1 },
    };
    return makeValidation<ISubject>(validation, finalData);
  }, [finalData]);

  const doPublish = useCallback(() => {
    const reasons = validateFields();
    setLoading(true);
    if (reasons.length == 0) {
      uploadArtifacts(finalData)
        .then((artifacts) =>
          axios({
            method: isEditing ? "PUT" : "POST",
            url: `${API_URL}subject/${isEditing ? "update" : "create"}`,
            data: preprocessDataBeforePost(finalData, artifacts),
          })
        )
        .then(handleSubjectCreate)
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

  const onSuggestChange = useCallback((value: string) => {
    if (value.length > 2) {
      axios
        .get<SubjectSearchParent | ApiError>(
          `${API_URL}subject/search-parent/${encodeURIComponent(value)}`
        )
        .then((response) => {
          const values = handleSubjectSearchParent(response);
          if (values) setSuggestions(values);
        })
        .catch(handleGenericError);
    }
  }, []);

  const addParentTag = useCallback(
    (tag: ITag) => {
      reduxAction(dispatch, {
        type: "CREATE_SUBJECT_DATA",
        arg: { parent: [...parent, tag] },
      });
    },
    [dispatch, parent]
  );

  const removeParentTag = useCallback(
    (index: number) => {
      const newArr = [...parent];
      newArr.splice(index, 1);
      reduxAction(dispatch, {
        type: "CREATE_SUBJECT_DATA",
        arg: { parent: newArr },
      });
    },
    [dispatch, parent]
  );

  const ParentTagsBox = useTagsBox(parent, addParentTag, removeParentTag);

  const addTag = useCallback(
    (tag: ITag) => {
      reduxAction(dispatch, {
        type: "CREATE_SUBJECT_DATA",
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
        type: "CREATE_SUBJECT_DATA",
        arg: { tags: newArr },
      });
    },
    [dispatch, tags]
  );

  const TagsBox = useTagsBox(tags, addTag, removeTag, true);

  return (
    <>
      <ValidationPopup
        validationFn={validateFields}
        sucess={creationState}
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
          <div>Parent Collections</div>
          {ParentTagsBox}
          <AutosuggestInput<Parents>
            style={{ marginTop: "8px" }}
            forceSuggestions={suggestions}
            getValue={getParentVal}
            renderSuggestion={renderParent}
            id="parent-subject"
            onChangeCallback={onSuggestChange}
            submitCallback={(p) =>
              addParentTag({ name: getParentVal(p), id: getParentId(p) })
            }
            selectClear
          />
        </div>
      </Flex>
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
