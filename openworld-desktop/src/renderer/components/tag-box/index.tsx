import React, { useState, useCallback } from "react";
import "./index.scss";
import Tag from "../tag";

interface ITag {
  name: string;
  id: string;
}

export default function useTagsBox(
  initialTags: ITag[]
): [() => JSX.Element, (toAdd: ITag) => void, () => ITag[]] {
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

  const Container = () => (
    <div className="tags-container">
      {tags.map((tag, i) => (
        <Tag
          key={`tags-${tag}`}
          name={tag.name}
          close
          onCloseCallback={() => removeTag(i)}
        />
      ))}
    </div>
  );

  return [Container, addTag, getTags];
}
