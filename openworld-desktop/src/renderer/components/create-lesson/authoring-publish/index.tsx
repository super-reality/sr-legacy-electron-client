import React, { useCallback, useState, useEffect } from "react";
import "../../containers.scss";
import "../../popups.scss";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import * as crypto from "crypto";
import { bool } from "aws-sdk/clients/signer";
import Flex from "../../flex";
import ButtonSimple from "../../button-simple";
import AutosuggestInput from "../../autosuggest-input";
import store, { AppState } from "../../../redux/stores/renderer";
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
import { getParentVal, getParentId, renderParent } from "../../links";
import uploadFileToS3 from "../../../../utils/uploadImage";

export default function PublishAuthoring(): JSX.Element {
  const dispatch = useDispatch();
  const [suggestions, setSuggestions] = useState<Parents[]>([]);
  const { entry } = useSelector((state: AppState) => state.createLesson);
  const lessondata = useSelector((state: AppState) => state.createLesson);
  const [creationState, setCreatoinState] = useState(true);

  const setEntry = useCallback(
    (_entry: number) => {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_DATA",
        arg: { entry: _entry },
      });
    },
    [dispatch]
  );
  const gSetLoadingState = useCallback(
    (_entry: bool) =>
      reduxAction(dispatch, { type: "SET_LOADING_STATE", arg: _entry }),
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

  const preprocessLessonDataBeforePost = (postData: ILesson): ILesson => {
    const localData = { ...postData };
    const icon = crypto.createHash("md5").update(localData.icon).digest("hex");
    const medias = localData.medias.map((item: string, idx: Number) => {
      return crypto.createHash("md5").update(item).digest("hex");
    });
    const steps = localData.steps.map((element, idx) => {
      const image = crypto
        .createHash("md5")
        .update(element.image)
        .digest("hex");
      return { ...element, image };
    });
    return { ...localData, icon, medias, steps };
  };

  const afterProcessLessonDataBeforePost = (
    lessonId: string,
    originlessondata: ILesson,
    postLessonData: ILesson
  ): void => {
    uploadFileToS3(
      originlessondata.icon.split('"').join(""),
      `${postLessonData.icon + lessonId}.png`
    );
    for (let i = 0; i < originlessondata.medias.length; i += 1) {
      uploadFileToS3(
        originlessondata.medias[i],
        `${postLessonData.medias[i] + lessonId}.png`
      );
    }
    for (let i = 0; i < originlessondata.steps.length; i += 1) {
      uploadFileToS3(
        originlessondata.steps[i].image,
        `${postLessonData.steps[i].image + lessonId}png`
      );
    }
    reduxAction(store.dispatch, { type: "CREATE_LESSON_RESET", arg: null });
    gSetLoadingState(false);
  };

  const lessonPublish = useCallback(() => {
    const reasons = validateFields();
    const postLessonData = preprocessLessonDataBeforePost(lessondata);
    if (reasons.length == 0) {
      axios
        .post<ApiError | LessonResp>(`${API_URL}lesson/create`, postLessonData)
        .then((res) => {
          if (res.status == 200) {
            gSetLoadingState(true);
            handleLessonCreate(res.data).then((lessonId) => {
              afterProcessLessonDataBeforePost(
                lessonId,
                lessondata,
                postLessonData
              );
            });
          }
        })
        .catch((err) => {
          setCreatoinState(false);
          open();
          handleGenericError(err);
        });
    }
    setCreatoinState(false);
    open();
  }, [open, lessondata]);

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
          <div className="title">Please review before publishing:</div>
          {validateFields().map((r) => (
            <div className="line" key={r}>
              {r}
            </div>
          ))}
          {creationState == true ? (
            <div className="line">Creation of this lesson succeed</div>
          ) : (
            <div className="line">Creation of this lesson failed.</div>
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
          onClick={lessonPublish}
        >
          Publish
        </ButtonSimple>
      </Flex>
    </>
  );
}
