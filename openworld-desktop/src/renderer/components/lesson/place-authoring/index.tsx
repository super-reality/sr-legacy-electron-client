import React, {useCallback, useState} from "react";
import "./index.scss";
import Flex from "../../flex";

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
    <div className="inner-container">
      <Flex>
        <div>
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
        <div>
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
        <div>
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
