import React, { useCallback, useState } from "react";
import "../create-lesson/index.scss";
import "../containers.scss";
import Flex from "../flex";
import Select from "../select";
import ButtonSimple from "../button-simple";

const visibilityOptions = ["public", "friends", "private"];

const entryOptions = ["bid", "free", "fixed", "range"];

export default function PublishAuthoring(): JSX.Element {
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
    <>
      <Flex>
        <div className="container-with-desc">
          <div>Parent Subject</div>
          <input
            placeholder="Title"
            value={title}
            onChange={handleChange}
            onKeyDown={handleChange}
          />
        </div>
      </Flex>
      <Flex style={{ marginTop: "8px" }}>
        <ButtonSimple onClick={() => {}}>Publish</ButtonSimple>
      </Flex>
    </>
  );
}
