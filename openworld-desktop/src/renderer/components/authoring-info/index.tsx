import React, { useCallback, useState } from "react";
import "../create-lesson/index.scss";
import "../containers.scss";
import Flex from "../flex";
import InsertMedia from "../insert-media";
import { InputChangeEv, AreaChangeEv } from "../../../types/utils";
import Select from "../select";

const difficultyOptions = ["Begginer", "Intermediate", "Advanced"];

export default function InfoAuthoring(): JSX.Element {
  const [title, setTitle] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [difficulty, setDifficulty] = useState(difficultyOptions[1]);

  const handleChange = useCallback((e: InputChangeEv): void => {
    setTitle(e.currentTarget.value);
  }, []);

  const handleAreaChange = useCallback((e: AreaChangeEv): void => {
    setTitle(e.currentTarget.value);
  }, []);

  return (
    <>
      <Flex style={{ gridArea: "icon" }}>
        <div className="container-with-desc">
          <div>Icon</div>
          <InsertMedia
            imgUrl={iconUrl}
            style={{ width: "32px", height: "32px" }}
            callback={setIconUrl}
          />
        </div>
      </Flex>
      <Flex>
        <div className="container-with-desc">
          <div>TItle</div>
          <input
            placeholder="Title"
            value={title}
            onChange={handleChange}
            onKeyDown={handleChange}
          />
        </div>
      </Flex>
      <Flex>
        <div className="container-with-desc">
          <div>Short Description</div>
          <input
            placeholder="Title"
            value={title}
            onChange={handleChange}
            onKeyDown={handleChange}
          />
        </div>
      </Flex>
      <Flex style={{ gridArea: "text" }}>
        <div className="container-with-desc">
          <div>Description</div>
          <textarea
            style={{ resize: "vertical", minHeight: "64px" }}
            placeholder=""
            value={title}
            onChange={handleAreaChange}
            onKeyDown={handleAreaChange}
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
