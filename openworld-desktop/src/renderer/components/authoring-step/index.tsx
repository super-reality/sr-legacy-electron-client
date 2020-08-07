import React, {useCallback, useState} from "react";
import "./index.scss";
import "../create-lesson/index.scss";
import InsertMedia from "../insert-media";
import Flex from "../flex";

export default function StepAuthoring(): JSX.Element {
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

  return (
    <div className="inner-container step-authoring-grid">
      <Flex style={{gridArea: "step"}}>
        <div className="container-with-desc">
          <div>Step</div>
          <input
            placeholder="Step name"
            value={title}
            onChange={handleChange}
            onKeyDown={handleChange}
          />
        </div>
      </Flex>
      <Flex style={{gridArea: "event"}}>
        <div className="container-with-desc">
          <div>Event</div>
          <input
            placeholder="Event name"
            value={title}
            onChange={handleChange}
            onKeyDown={handleChange}
          />
        </div>
      </Flex>
      <div style={{gridArea: "images", justifyContent: "space-between", flexWrap: "wrap"}}>
        <div className="step-insert-images">
          <InsertMedia
            style={{width: "100%", height: "125px", gridArea: "a"}}
            callback={insertIcon}
          />
          <InsertMedia
            style={{width: "100%", height: "125px", gridArea: "b"}}
            callback={insertIcon}
          />
          <InsertMedia
            style={{width: "100%", height: "125px", gridArea: "c"}}
            callback={insertIcon}
          />
          <InsertMedia
            style={{width: "100%", height: "125px", gridArea: "d"}}
            callback={insertIcon}
          />
          <InsertMedia
            style={{width: "100%", height: "125px", gridArea: "e"}}
            callback={insertIcon}
          />
          <InsertMedia
            style={{width: "100%", height: "125px", gridArea: "f"}}
            callback={insertIcon}
          />
        </div>
      </div>
      <Flex style={{gridArea: "action"}}>
        <div className="container-with-desc">
          <div>Action</div>
          <input
            placeholder="Action name"
            value={title}
            onChange={handleChange}
            onKeyDown={handleChange}
          />
        </div>
      </Flex>
      <Flex style={{gridArea: "text"}}>
        <textarea
          style={{maxWidth: "calc(100vw - 130px)"}}
          placeholder=""
          value={title}
          onChange={handleAreaChange}
          onKeyDown={handleAreaChange}
        />
      </Flex>
    </div>
  );
}
