import React, { useCallback, useState } from "react";
import "../create-lesson/index.scss";
import "../containers.scss";
import Flex from "../flex";
import Select from "../select";

const visibilityOptions = ["public", "friends", "private"];

const entryOptions = ["bid", "free", "fixed", "range"];

export default function RulesAuthoring(): JSX.Element {
  const [visibility, setVisibility] = useState(visibilityOptions[0]);
  const [entry, setEntry] = useState(entryOptions[0]);

  return (
    <>
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
          <div>Entry</div>
          <Select current={entry} options={entryOptions} callback={setEntry} />
        </div>
      </Flex>
    </>
  );
}
