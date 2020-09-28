import React, { useCallback, useState } from "react";
import "../../containers.scss";
import { useDispatch, useSelector } from "react-redux";
import Flex from "../../flex";
import InsertMedia from "../../insert-media";
import { InputChangeEv, AreaChangeEv } from "../../../../types/utils";
import reduxAction from "../../../redux/reduxAction";
import { AppState } from "../../../redux/stores/renderer";
import { DifficultyOptions } from "../../../api/types/lesson/lesson";
import constantFormat from "../../../../utils/constantFormat";
import BaseInput from "../../base-input";
import BaseSelect from "../../base-select";
import BaseTextArea from "../../base-textarea";

export default function InfoAuthoring(): JSX.Element {
  const dispatch = useDispatch();
  const { name, icon, shortDescription, description } = useSelector(
    (state: AppState) => state.createLesson
  );
  const [difficulty, setDifficulty] = useState(DifficultyOptions.Intermediate);

  const setIcon = useCallback(
    (url: string) => {
      reduxAction(dispatch, { type: "CREATE_LESSON_DATA", arg: { icon: url } });
    },
    [dispatch]
  );

  const handleNameChange = useCallback(
    (e: InputChangeEv): void =>
      reduxAction(dispatch, {
        type: "CREATE_LESSON_DATA",
        arg: { name: e.currentTarget.value },
      }),
    [dispatch]
  );

  const handleShortDescChange = useCallback(
    (e: InputChangeEv): void =>
      reduxAction(dispatch, {
        type: "CREATE_LESSON_DATA",
        arg: { shortDescription: e.currentTarget.value },
      }),
    [dispatch]
  );

  const handleDescChange = useCallback(
    (e: AreaChangeEv): void =>
      reduxAction(dispatch, {
        type: "CREATE_LESSON_DATA",
        arg: { description: e.currentTarget.value },
      }),
    [dispatch]
  );

  return (
    <>
      <Flex style={{ gridArea: "icon" }}>
        <div className="container-with-desc">
          <div>Icon</div>
          <InsertMedia
            snip
            url
            disk
            keepSize
            imgUrl={icon}
            style={{ width: "32px", height: "32px" }}
            callback={setIcon}
          />
        </div>
      </Flex>
      <BaseInput
        title="TItle"
        placeholder="Title"
        value={name}
        onChange={handleNameChange}
      />
      <BaseInput
        title="Short Description"
        placeholder="Description"
        value={shortDescription}
        onChange={handleShortDescChange}
      />
      <BaseTextArea
        style={{ gridArea: "text" }}
        title="Description"
        placeholder=""
        value={description}
        onChange={handleDescChange}
      />
      <BaseSelect
        title="Difficulty"
        current={difficulty}
        options={Object.values(DifficultyOptions)}
        optionFormatter={constantFormat(DifficultyOptions)}
        callback={setDifficulty}
      />
    </>
  );
}
