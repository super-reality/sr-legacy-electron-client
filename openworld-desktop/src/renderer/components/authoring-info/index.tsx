import React, { useCallback, useState } from "react";
import "../create-lesson/index.scss";
import "../containers.scss";
import { useDispatch, useSelector } from "react-redux";
import Flex from "../flex";
import InsertMedia from "../insert-media";
import { InputChangeEv, AreaChangeEv } from "../../../types/utils";
import Select from "../select";
import reduxAction from "../../redux/reduxAction";
import { AppState } from "../../redux/stores/renderer";

const difficultyOptions = ["Begginer", "Intermediate", "Advanced"];

export default function InfoAuthoring(): JSX.Element {
  const dispatch = useDispatch();
  const { name, icon, shortDescription, description } = useSelector(
    (state: AppState) => state.createLesson
  );
  const [difficulty, setDifficulty] = useState(difficultyOptions[1]);

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
            keepSize
            imgUrl={icon}
            style={{ width: "32px", height: "32px" }}
            callback={setIcon}
          />
        </div>
      </Flex>
      <Flex>
        <div className="container-with-desc">
          <div>TItle</div>
          <input
            placeholder="Title"
            value={name}
            onChange={handleNameChange}
            onKeyDown={handleNameChange}
          />
        </div>
      </Flex>
      <Flex>
        <div className="container-with-desc">
          <div>Short Description</div>
          <input
            placeholder="Title"
            value={shortDescription}
            onChange={handleShortDescChange}
            onKeyDown={handleShortDescChange}
          />
        </div>
      </Flex>
      <Flex style={{ gridArea: "text" }}>
        <div className="container-with-desc">
          <div>Description</div>
          <textarea
            style={{ resize: "vertical", minHeight: "64px" }}
            placeholder=""
            value={description}
            onChange={handleDescChange}
            onKeyDown={handleDescChange}
          />
        </div>
      </Flex>
      <Flex>
        <div className="container-with-desc">
          <div>Difficulty</div>
          <Select
            current={difficulty}
            options={difficultyOptions}
            callback={setDifficulty}
          />
        </div>
      </Flex>
    </>
  );
}
