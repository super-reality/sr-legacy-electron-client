import React, {useCallback, useState} from "react";
import "./index.scss";
import InsertMedia from "../../insert-media";
import Flex from "../../flex";

export default function DescAuthoring(): JSX.Element {
  const insertIcon = useCallback(() => {}, []);
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
          <div>Icon</div>
          <InsertMedia
            style={{width: "32px", height: "32px"}}
            callback={insertIcon}
          />
        </div>
        <div>
          <div>Lesson Title</div>
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
