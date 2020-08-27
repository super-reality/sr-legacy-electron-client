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
import handleSubjectSearchParent from "../../../api/handleSubjectSearchParent";
import { EntryOptions } from "../../../api/types/lesson/lesson";
import constantFormat from "../../../../utils/constantFormat";
import BaseSelect from "../../base-select";
import { getParentVal, getParentId, renderParent } from "../../links";
import { Parents } from "../../../api/types/lesson/search-parent";
import Link from "../../../api/types/link/link";
import AutosuggestInput from "../../autosuggest-input";
import uploadFileToS3 from "../../../../utils/uploadFileToS3";
import SubjectCreate from "../../../api/types/subject/create";
import handleSubjectCreate from "../../../api/handleSubjectCreate";
import SubjectSearchParent from "../../../api/types/subject/search-parent";
import { ISubject } from "../../../api/types/subject/subject";
import getFileSha1 from "../../../../utils/getFileSha1";
import getFileExt from "../../../../utils/getFileExt";
import setLoading from "../../../redux/utils/setLoading";

const uploadArtifacts = (
  original: ISubject
): Promise<Record<string, string>> => {
  const fileNames = [];
  const iconPath = original.icon.split('"').join("");
  fileNames.push(iconPath);
  original.medias.forEach((mediaPath) => fileNames.push(mediaPath));
  const ret: Record<string, string> = {};
  return Promise.all(
    fileNames.map((file) =>
      uploadFileToS3(file).then((f) => {
        ret[file] = f;
      })
    )
  ).then(() => ret);
};

const preprocessDataBeforePost = (
  postData: ISubject,
  artifacts: Record<string, string>
): ISubject => {
  const localData = { ...postData };
  const icon = artifacts[localData.icon];
  const medias = localData.medias.map((item: string) => {
    return artifacts[item];
  });
  return { ...localData, icon, medias };
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
      <Popup width="400px" height="auto">
        <div className="validation-popup">
          {creationState == true ? (
            <>
              <div className="title green">Sucess</div>
              <div className="line">The subject was created sucessfuly!</div>
            </>
          ) : (
            <>
              <div className="title">Please review before publishing:</div>
              {validateFields().map((r) => (
                <div className="line" key={r}>
                  {r}
                </div>
              ))}
              {creationState == false && validateFields().length == 0 ? (
                <div className="line">Creation of this subject failed.</div>
              ) : (
                <></>
              )}
            </>
          )}
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
