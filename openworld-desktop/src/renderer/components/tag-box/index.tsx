import React, { useState, useCallback, useEffect, useMemo } from "react";
import { ReactComponent as AddIcon } from "../../../assets/svg/add.svg";
import "./index.scss";
import "../tag/index.scss";
import Tag from "../tag";
import { InputChangeEv } from "../../../types/utils";

export interface ITag {
  name: string;
  id: string;
}

interface AddTagProps {
  callback: (toAdd: ITag) => void;
}

function AddTag(props: AddTagProps): JSX.Element {
  const { callback } = props;
  const [showInput, setShowInput] = useState(false);
  const [text, setText] = useState("");

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    const str = e.currentTarget.value;
    if (e.keyCode === 13) {
      callback({ id: str, name: str });
      setShowInput(false);
      e.stopPropagation();
    }
  };

  const handleTextChange = useCallback(
    (e: InputChangeEv): void => setText(e.currentTarget.value),
    []
  );

  const click = useCallback(() => {
    if (!showInput) setShowInput(true);
  }, [showInput]);
  return (
    <div className="tag" style={{ minWidth: "24px" }} onClick={click}>
      {showInput ? (
        <input
          ref={(input) => input?.focus()}
          value={text}
          onKeyUp={handleKeyUp}
          onChange={handleTextChange}
        />
      ) : (
        <div className="close">
          <AddIcon
            fill="var(--color-icon)"
            width="12px"
            height="12px"
            style={{ margin: "auto" }}
          />
        </div>
      )}
    </div>
  );
}

export default function useTagsBox(
  initialTags: ITag[],
  addTagFn: (tag: ITag) => void,
  removeTagFn: (i: number) => void,
  input?: boolean
): JSX.Element {
  const [tags, setTagsfn] = useState<ITag[]>([]);

  useEffect(() => setTagsfn(initialTags), [initialTags]);

  const addTag = useCallback((toAdd: ITag) => addTagFn(toAdd), [addTagFn]);

  const removeTag = useCallback((i: number) => removeTagFn(i), [removeTagFn]);

  return (
    <div className="tags-container">
      {tags.map((tag, i) => (
        <Tag
          key={`tags-${tag.id}`}
          name={tag.name}
          close
          onCloseCallback={() => removeTag(i)}
        />
      ))}
      {input ? <AddTag callback={addTag} /> : <></>}
    </div>
  );
}
