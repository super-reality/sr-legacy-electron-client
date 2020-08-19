import React, { useCallback, useState } from "react";
import "../create-lesson/index.scss";
import "../containers.scss";
import Flex from "../flex";
import InsertMedia from "../insert-media";
import { InputChangeEv, AreaChangeEv } from "../../../types/utils";
import Select from "../select";

const entryOptions = ["beginner", "intermediate", "advanced"];

export default function InfoAuthoring(): JSX.Element {
  const [iconUrl, setIconUrl] = useState("");
  const [title, setTitle] = useState("");
  const [sdescription, setSdescription] = useState("");
  const [description, setDescription] = useState("");
  const [entry, setEntry] = useState(entryOptions[0]);

  const handleChange = useCallback((e: InputChangeEv): void => {
    if (e.currentTarget.name == "Title") {
      setTitle(e.currentTarget.value);
    } else if (e.currentTarget.name == "SDescription") {
      setSdescription(e.currentTarget.value);
    } else if (e.currentTarget.name == "Description") {
      setDescription(e.currentTarget.value);
    }
  }, []);

  const handleAreaChange = useCallback((e: AreaChangeEv): void => {
    setDescription(e.currentTarget.value);
  }, []);

  return (
    <>
      <Flex style={{ gridArea: "icon" }}>
        <div className="container-with-desc">
          <div>Lesson Icon</div>
          <InsertMedia
            imgUrl={iconUrl}
            style={{ width: "32px", height: "32px" }}
            callback={setIconUrl}
          />
        </div>
      </Flex>
      <Flex>
        <div className="container-with-desc">
          <div>Lesson TItle</div>
          <input
            placeholder="Title"
            value={title}
            name="Title"
            onChange={handleChange}
            onKeyDown={handleChange}
          />
        </div>
      </Flex>
      <Flex>
        <div className="container-with-desc">
          <div>Lesson Short Description</div>
          <input
            placeholder="Short Description"
            value={sdescription}
            name="SDescription"
            onChange={handleChange}
            onKeyDown={handleChange}
          />
        </div>
      </Flex>
      <Flex style={{ gridArea: "text" }}>
        <div className="container-with-desc">
          <div>Lesson Description</div>
          <textarea
            style={{ resize: "vertical", minHeight: "64px" }}
            placeholder="Description"
            value={description}
            onChange={handleAreaChange}
            onKeyDown={handleAreaChange}
          />
        </div>
      </Flex>
      <Flex>
        <div className="container-with-desc">
          <div>Entry</div>
          <Select current={entry} options={entryOptions} callback={setEntry} />
        </div>
      </Flex>
      {/* <Flex>
        <div className="container-with-desc">
          <div>Tags</div>
          <input
            placeholder="Title"
            value={title}
            onChange={handleChange}
            onKeyDown={handleChange}
          />
        </div>
      </Flex> */}
    </>
  );
}
