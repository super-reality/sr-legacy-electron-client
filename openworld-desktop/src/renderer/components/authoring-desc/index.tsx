import React, {useCallback, useState} from "react";
import "./index.scss";
import "../containers.scss";
import "../create-lesson/index.scss";
import InsertMedia from "../insert-media";
import Flex from "../flex";

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
    <div className="inner desc-authoring-grid">
      <Flex style={{gridArea: "icon"}}>
        <div className="container-with-desc">
          <div>Icon</div>
          <InsertMedia
            style={{width: "32px", height: "32px"}}
            callback={insertIcon}
          />
        </div>
      </Flex>
      <Flex style={{gridArea: "title"}}>
        <div className="container-with-desc">
          <div>Lesson Title</div>
          <input
            placeholder="Title"
            value={title}
            onChange={handleChange}
            onKeyDown={handleChange}
          />
        </div>
      </Flex>
      <Flex style={{gridArea: "purpose"}}>
        <div className="container-with-desc">
          <div>Purpose</div>
          <input
            placeholder="Title"
            value={title}
            onChange={handleChange}
            onKeyDown={handleChange}
          />
        </div>
      </Flex>
      <Flex style={{gridArea: "tags"}}>
        <div className="container-with-desc">
          <div>Lesson Tags</div>
          <input
            placeholder="Title"
            value={title}
            onChange={handleChange}
            onKeyDown={handleChange}
          />
        </div>
      </Flex>
      <Flex style={{gridArea: "media"}}>
        <div className="container-with-desc">
          <div>Example Media</div>
          <div className="insert-images-div">
            <InsertMedia
              style={{width: "100%", height: "125px"}}
              callback={insertIcon}
            />
            <InsertMedia
              style={{width: "100%", height: "125px"}}
              callback={insertIcon}
            />
            <InsertMedia
              style={{width: "100%", height: "125px"}}
              callback={insertIcon}
            />
          </div>
        </div>
      </Flex>
    </div>
  );
}
