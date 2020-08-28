import React, { useCallback, useState, useEffect } from "react";
import "../../containers.scss";
import "../../popups.scss";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Flex from "../../flex";
import ButtonSimple from "../../button-simple";
import AutosuggestInput from "../../autosuggest-input";
import { AppState } from "../../../redux/stores/renderer";
import reduxAction from "../../../redux/reduxAction";
import { API_URL } from "../../../constants";
import { ApiError } from "../../../api/types";
import handleLessonCreate from "../../../api/handleLessonCreate";
import handleGenericError from "../../../api/handleGenericError";
import { LessonResp } from "../../../api/types/lesson/create";
import handleLessonSearchParent from "../../../api/handleLessonSearchParent";
import LessonSearchParent, {
  Parents,
} from "../../../api/types/lesson/search-parent";
import useTagsBox from "../../tag-box";
import Link from "../../../api/types/link/link";
import { EntryOptions, ILesson } from "../../../api/types/lesson/lesson";
import constantFormat from "../../../../utils/constantFormat";
import BaseSelect from "../../base-select";
import usePopup from "../../../hooks/usePopup";
import uploadFileToS3 from "../../../../utils/uploadFileToS3";
import getFileSha1 from "../../../../utils/getFileSha1";
import getFileExt from "../../../../utils/getFileExt";
import { getParentVal, getParentId, renderParent } from "../../links";
import setLoading from "../../../redux/utils/setLoading";

const uploadArtifacts = (
  original: ILesson
): Promise<Record<string, string>> => {
  const fileNames = [];
  const iconPath = original.icon.split('"').join("");
  fileNames.push(iconPath);
  original.medias.forEach((mediaPath) => fileNames.push(mediaPath));
  original.steps.forEach((step) => fileNames.push(step.image));
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
  postData: ILesson,
  artifacts: Record<string, string>
): ILesson => {
  const localData = { ...postData };
  const icon = artifacts[localData.icon];
  const medias = localData.medias.map((item: string) => {
    return artifacts[item];
  });
  const steps = localData.steps.map((element) => {
    const image = artifacts[element.image];
    return { ...element, image };
  });
  return { ...localData, icon, medias, steps };
};

export default function PublishAuthoring(): JSX.Element {
  const dispatch = useDispatch();
  const [suggestions, setSuggestions] = useState<Parents[]>([]);
  const { entry } = useSelector((state: AppState) => state.createLesson);
  const lessondata = useSelector((state: AppState) => state.createLesson);
  const [creationState, setCreationState] = useState(true);

  const setEntry = useCallback(
    (_entry: number) => {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_DATA",
        arg: { entry: _entry },
      });
    },
    [dispatch]
  );

  const [Popup, open, closePopup] = usePopup(false);

  const validateFields = useCallback(() => {
    const reasons: string[] = [];
    if (lessondata.name.length == 0) reasons.push("Title is required");
    else if (lessondata.name.length < 5) reasons.push("Title is too short");

    if (lessondata.description.length == 0)
      reasons.push("Description is required");
    else if (lessondata.description.length < 10)
      reasons.push("Description is too short");

    if (lessondata.shortDescription.length == 0)
      reasons.push("Short description is required");
    else if (lessondata.shortDescription.length < 4)
      reasons.push("Short description is too short");

    if (lessondata.icon == "") reasons.push("Icon is required");
    if (lessondata.medias.length == 0) reasons.push("Media is required");

    if (lessondata.parent.length == 0)
      reasons.push("At least one parent subject is required");
    if (lessondata.steps.length == 0)
      reasons.push("At least one step is required");

    return reasons;
  }, [lessondata]);

  const doPublish = useCallback(() => {
    const reasons = validateFields();
    if (reasons.length == 0) {
      setLoading(true);
      uploadArtifacts(lessondata)
        .then((artifacts) =>
          axios.post<ApiError | LessonResp>(
            `${API_URL}lesson/create`,
            preprocessDataBeforePost(lessondata, artifacts)
          )
        )
        .then(handleLessonCreate)
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
  }, [dispatch, open, lessondata]);

  const onSuggestChange = useCallback((value: string) => {
    if (value.length > 2) {
      axios
        .get<LessonSearchParent | ApiError>(
          `${API_URL}lesson/search-parent/${encodeURIComponent(value)}`
        )
        .then((response) => {
          const values = handleLessonSearchParent(response);
          if (values) setSuggestions(values);
        })
        .catch(handleGenericError);
    }
  }, []);

  const [ParentTagsBox, addParentTag, getParentTags] = useTagsBox([]);

  useEffect(() => {
    const tagsList: Link[] = getParentTags().map((t) => {
      return { _id: t.id, type: "subject" };
    });
    reduxAction(dispatch, {
      type: "CREATE_LESSON_DATA",
      arg: { parent: tagsList },
    });
  }, [getParentTags]);

  const [TagsBox, addTag, getTags] = useTagsBox([], true);

  useEffect(() => {
    const tagsList: string[] = getTags().map((t) => t.name);
    reduxAction(dispatch, {
      type: "CREATE_LESSON_DATA",
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
              <div className="line">The lesson was created sucessfuly!</div>
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
                <div className="line">Creation of this lesson failed.</div>
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
          <div>Parent Subjects</div>
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
