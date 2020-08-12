import React, { useCallback, useState } from "react";
import "../create-lesson/index.scss";
import "../containers.scss";
import Flex from "../flex";

export default function PlaceAuthoring(): JSX.Element {
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

  return (
    <div className="inner">
      <Flex>
        <div className="container-with-desc">
          <div>Collection</div>
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
          <div>Subject</div>
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
          <div>Parent Lesson (optional)</div>
          <input
            placeholder="Title"
            value={title}
            onChange={handleChange}
            onKeyDown={handleChange}
          />
        </div>
      </Flex>
    </div>
  );
}
