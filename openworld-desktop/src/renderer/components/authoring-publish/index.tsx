import React, { useCallback, useState } from "react";
import "../create-lesson/index.scss";
import "../containers.scss";
import Flex from "../flex";
import Select from "../select";
import ButtonSimple from "../button-simple";

const visibilityOptions = ["public", "friends", "private"];

const entryOptions = ["bid", "free", "fixed", "range"];

const ownerSuggestions = ["owner1", "owner2", "owner3", "owner4"];

export default function PublishAuthoring(): JSX.Element {
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState(visibilityOptions[0]);
  const [ownership, setOwnership] = useState(ownerSuggestions[0]);
  const [entry, setEntry] = useState(entryOptions[0]);

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
      <Flex>
        <div className="container-with-desc">
          <div>Visibility</div>
          <Select
            current={visibility}
            options={visibilityOptions}
            callback={setVisibility}
          />
        </div>
      </Flex>
      <Flex>
        <div className="container-with-desc">
          <div>Ownership</div>
          <Select
            current={ownership}
            options={ownerSuggestions}
            callback={setOwnership}
          />
        </div>
      </Flex>
      <Flex>
        <div className="container-with-desc">
          <div>Entry</div>
          <Select current={entry} options={entryOptions} callback={setEntry} />
        </div>
      </Flex>
      <Flex style={{ marginTop: "8px" }}>
        <ButtonSimple onClick={() => {}}>Publish</ButtonSimple>
      </Flex>
    </>
  );
}
