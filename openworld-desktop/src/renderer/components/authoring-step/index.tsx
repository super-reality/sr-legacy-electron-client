import React, {useCallback, useState} from "react";
import "./index.scss";
import "../containers.scss";
import "../create-lesson/index.scss";
import InsertMedia from "../insert-media";
import Flex from "../flex";
import Select from "../select";

const options = [
  "One", "Two", "Three"
];

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
    <div className="inner step-authoring-grid">
      <Flex style={{gridArea: "step"}}>
        <div className="container-with-desc">
          <div>Step</div>
          <input
            placeholder="Event name"
            value={title}
            onChange={handleChange}
            onKeyDown={handleChange}
          />
        </div>
      </Flex>
      <Flex style={{gridArea: "event"}}>
        <div className="container-with-desc select-div-container">
          <div className="select-div-title">Event</div>
          <Select
            options={options}
            current={options[1]}
            callback={(s) => { return s; }}
          />
        </div>
      </Flex>
      <div
        style={{
          gridArea: "images",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
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
      <Flex style={{gridArea: "action"}}>
        <div className="container-with-desc select-div-container">
          <div className="select-div-title">Action</div>
          <Select
            options={options}
            current={options[1]}
            callback={(s) => { return s; }}
          />
        </div>
      </Flex>
      <Flex style={{gridArea: "text"}}>
        <textarea
          style={{resize: "vertical", minHeight: "64px"}}
          placeholder=""
          value={title}
          onChange={handleAreaChange}
          onKeyDown={handleAreaChange}
        />
      </Flex>
      <Flex style={{gridArea: "next"}}>
        <div className="container-with-desc select-div-container">
          <div className="select-div-title">Next</div>
          <Select
            options={options}
            current={options[1]}
            callback={(s) => { return s; }}
          />
        </div>
      </Flex>
    </div>
  );
}
