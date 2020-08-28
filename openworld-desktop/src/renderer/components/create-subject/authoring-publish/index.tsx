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
import handleSubjectSearchParent from "../../../api/handleSubjectSearchParent";
import { EntryOptions } from "../../../api/types/lesson/lesson";
import constantFormat from "../../../../utils/constantFormat";
import BaseSelect from "../../base-select";
import { getParentVal, getParentId, renderParent } from "../../links";
import { Parents } from "../../../api/types/lesson/search-parent";
import Link from "../../../api/types/link/link";
import AutosuggestInput from "../../autosuggest-input";
import SubjectCreate from "../../../api/types/subject/create";
import handleSubjectCreate from "../../../api/handleSubjectCreate";
import SubjectSearchParent from "../../../api/types/subject/search-parent";
import { ISubject } from "../../../api/types/subject/subject";
import setLoading from "../../../redux/utils/setLoading";
import usePopupValidation from "../../../hooks/usePopupValidation";
import uploadMany from "../../../../utils/uploadMany";
import makeValidation from "../../../../utils/makeValidation";

const uploadArtifacts = (original: ISubject) => {
  const fileNames = [];
  fileNames.push(original.icon);
  original.medias.forEach((mediaPath) => fileNames.push(mediaPath));
  return uploadMany(fileNames);
};

const preprocessDataBeforePost = (
  postData: ISubject,
  artifacts: Record<string, string>
): ISubject => {
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
  const [suggestions, setSuggestions] = useState<Parents[]>([]);
  const { entry } = useSelector((state: AppState) => state.createSubject);
  const finalData = useSelector((state: AppState) => state.createSubject);
  const [creationState, setCreationState] = useState(true);

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

  const validation = {
    name: { name: "Title", minLength: 4 },
    description: { name: "Description", minLength: 4 },
    shortDescription: { name: "Short description", minLength: 4 },
    icon: { name: "Icon", minLength: 4 },
    medias: { name: "Media", minItems: 1 },
    parent: { name: "Parent Collections", minItems: 1 },
  };

  const validateFields = useCallback(
    () => makeValidation(validation, finalData),
    [finalData]
  );

  const doPublish = useCallback(() => {
    const reasons = validateFields();
    setLoading(true);
    if (reasons.length == 0) {
      uploadArtifacts(finalData)
        .then((artifacts) =>
          axios.post<SubjectCreate | ApiError>(
            `${API_URL}subject/create`,
            preprocessDataBeforePost(finalData, artifacts)
          )
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

  const [ParentTagsBox, addParentTag, getParentTags] = useTagsBox([]);

  useEffect(() => {
    const tagsList: Link[] = getParentTags().map((t) => {
      return { _id: t.id, type: "collection" };
    });
    reduxAction(dispatch, {
      type: "CREATE_SUBJECT_DATA",
      arg: { parent: tagsList },
    });
  }, [getParentTags]);

  const [TagsBox, addTag, getTags] = useTagsBox([], true);

  useEffect(() => {
    const tagsList: string[] = getTags().map((t) => t.name);
    reduxAction(dispatch, {
      type: "CREATE_SUBJECT_DATA",
      arg: { tags: tagsList },
    });
  }, [getTags]);

  return (
    <>
      <ValidationPopup validationFn={validateFields} sucess={creationState} />
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
          <ParentTagsBox />
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
