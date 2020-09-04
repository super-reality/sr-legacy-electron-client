import React, { useState, useCallback } from "react";
import { ReactComponent as AddIcon } from "../../../assets/svg/add.svg";
import "./index.scss";
import "../tag/index.scss";
import Tag from "../tag";
import { InputChangeEv } from "../../../types/utils";
import reduxAction from "../../redux/reduxAction";

interface ITag {
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
  input?: boolean
): [() => JSX.Element, (toAdd: ITag) => void, () => ITag[], () => void] {
  const [tags, setTags] = useState<ITag[]>(initialTags);

  const addTag = useCallback(
    (toAdd: ITag) => {
      if (tags.filter((t) => t.id == toAdd.id).length == 0)
        setTags([...tags, toAdd]);
    },
    [tags]
  );

  const removeTag = useCallback(
    (index: number) => {
      const newArr = [...tags];
      newArr.splice(index, 1);
      setTags(newArr);
    },
    [tags]
  );

  const getTags = useCallback(() => tags, [tags]);
  const clearAllTags = useCallback(() => {
    setTags([]);
  }, []);

  const Container = () => (
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

  return [Container, addTag, getTags, clearAllTags];
}
