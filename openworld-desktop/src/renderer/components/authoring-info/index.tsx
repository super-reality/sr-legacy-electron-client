import React, { useCallback, useState } from "react";
import "../create-lesson/index.scss";
import "../containers.scss";
import Flex from "../flex";
import InsertMedia from "../insert-media";

export default function InfoAuthoring(): JSX.Element {
  const [title, setTitle] = useState("");

  const handleChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.KeyboardEvent<HTMLInputElement>
    ): void => {
      setTitle(e.currentTarget.value);
    },
    []
  );

  const handleAreaChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.KeyboardEvent<HTMLTextAreaElement>
    ): void => {
      setTitle(e.currentTarget.value);
    },
    []
  );

  const setIconUrl = useCallback(() => {}, []);

  return (
    <>
      <Flex style={{ gridArea: "icon" }}>
        <div className="container-with-desc">
          <div>Icon</div>
          <InsertMedia
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
          <div>Tags</div>
          <input
            placeholder="Title"
            value={title}
            onChange={handleChange}
            onKeyDown={handleChange}
          />
        </div>
      </Flex>
    </>
  );
}
