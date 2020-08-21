import React, { useCallback, useState } from "react";
import "../create-lesson/index.scss";
import "../containers.scss";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Flex from "../flex";
import ButtonSimple from "../button-simple";
import AutosuggestInput from "../autosuggest-input";
import Select from "../select";
import { AppState } from "../../redux/stores/renderer";
import reduxAction from "../../redux/reduxAction";
import { API_URL } from "../../constants";
import { ApiError } from "../../api/types";
import handleLessonCreate from "../../api/handleLessonCreate";
import handleGenericError from "../../api/handleGenericError";
import LessonCreate from "../../api/types/lesson/create";
import handleLessonSearchParent from "../../api/handleLessonSearchParent";
import LessonSearchParent, {
  Parents,
} from "../../api/types/lesson/search-parent";

const getVal = (p: Parents) =>
  p.subjectName || p.collectionName || p.lessonName || "";
const renderVal = (p: Parents) => (
  <div>{p.subjectName || p.collectionName || p.lessonName || ""}</div>
);

const entryOptions = ["Bid", "Invite", "Free"]; // ?

export default function PublishAuthoring(): JSX.Element {
  const dispatch = useDispatch();
  const [suggestions, setSuggestions] = useState<Parents[]>([]);
  const { entry } = useSelector((state: AppState) => state.createLesson);
  const lessondata = useSelector((state: AppState) => state.createLesson);

  const setEntry = useCallback(
    (_entry: string) => {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_DATA",
        arg: { entry: _entry },
      });
    },
    [dispatch]
  );

  const lessonPublish = useCallback(() => {
    axios
      .post<LessonCreate | ApiError>(`${API_URL}/lesson/create`, lessondata)
      .then(handleLessonCreate)
      .catch(handleGenericError);
  }, [lessondata]);

  // Teach Autosuggest how to calculate suggestions for any given input value.
  const getParentsFilter = useCallback(
    (str: string) => {
      return suggestions;
    },
    [suggestions]
  );

  const onSuggestChange = useCallback((value: string) => {
    if (value.length > 2) {
      axios
        .get<LessonSearchParent | ApiError>(
          `${API_URL}lesson/search-parent/${value}`
        )
        .then((response) => {
          const values = handleLessonSearchParent(response);
          if (values) setSuggestions(values);
        })
        .catch(handleGenericError);
    }
  }, []);

  return (
    <>
      <Flex>
        <div className="container-with-desc">
          <div>Parent Subject</div>
          <AutosuggestInput<Parents>
            forceSuggestions={suggestions}
            getValue={getVal}
            renderSuggestion={renderVal}
            id="parent-subject"
            onChangeCallback={onSuggestChange}
            submitCallback={(l) => console.log(l)}
          />
        </div>
      </Flex>
      <Flex>
        <div className="container-with-desc">
          <div>Entry</div>
          <Select current={entry} options={entryOptions} callback={setEntry} />
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
