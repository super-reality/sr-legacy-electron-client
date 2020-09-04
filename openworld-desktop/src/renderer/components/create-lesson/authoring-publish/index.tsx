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
import { getParentVal, getParentId, renderParent } from "../../links";
import setLoading from "../../../redux/utils/setLoading";
import usePopupValidation from "../../../hooks/usePopupValidation";
import uploadMany from "../../../../utils/uploadMany";
import makeValidation, {
  ValidationFields,
} from "../../../../utils/makeValidation";

const uploadArtifacts = (
  original: ILesson
): Promise<Record<string, string>> => {
  const fileNames = [];
  fileNames.push(original.icon);
  original.medias.forEach((mediaPath) => fileNames.push(mediaPath));
  original.steps.forEach((step) => fileNames.push(...step.images));
  return uploadMany(fileNames);
};

const preprocessDataBeforePost = (
  postData: ILesson,
  artifacts: Record<string, string>
): ILesson => {
  const result = {
    ...postData,
    icon: artifacts[postData.icon],
    medias: postData.medias.map((item: string) => {
      return artifacts[item];
    }),
    steps: postData.steps.map((element) => {
      return {
        ...element,
        images: element.images.map((img: string) => {
          return artifacts[img];
        }),
      };
    }),
  };
  return result;
};

export default function PublishAuthoring(): JSX.Element {
  const dispatch = useDispatch();
  const [suggestions, setSuggestions] = useState<Parents[]>([]);
  const { entry } = useSelector((state: AppState) => state.createLesson);
  const finalData = useSelector((state: AppState) => state.createLesson);
  const [creationState, setCreationState] = useState(true);
  const [ParentTagsBox, addParentTag, getParentTags, clearAllTags] = useTagsBox(
    []
  );

  const setEntry = useCallback(
    (_entry: number) => {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_DATA",
        arg: { entry: _entry },
      });
    },
    [dispatch]
  );

  const [ValidationPopup, open] = usePopupValidation("lesson");

  const validation: ValidationFields<ILesson> = {
    name: { name: "Title", minLength: 4 },
    description: { name: "Description", minLength: 4 },
    shortDescription: { name: "Short description", minLength: 4 },
    icon: { name: "Icon", minLength: 4 },
    medias: { name: "Media", minItems: 1 },
    parent: { name: "Parent Collections", minItems: 1 },
    steps: { name: "Step", minItems: 1 },
  };

  const validateFields = useCallback(
    () => makeValidation<ILesson>(validation, finalData),
    [finalData]
  );

  const doPublish = useCallback(() => {
    const reasons = validateFields();
    if (reasons.length == 0) {
      setLoading(true);
      uploadArtifacts(finalData)
        .then((artifacts) =>
          axios.post<ApiError | LessonResp>(
            `${API_URL}lesson/create`,
            preprocessDataBeforePost(finalData, artifacts)
          )
        )
        .then(handleLessonCreate)
        .then(() => {
          setLoading(false);
          setCreationState(true);
          open();
          clearAllTags();
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
  }, [dispatch, open, finalData]);

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
