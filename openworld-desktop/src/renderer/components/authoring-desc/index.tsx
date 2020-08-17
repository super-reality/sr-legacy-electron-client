import React, { useCallback, useState, useEffect, useMemo } from "react";
import "./index.scss";
import "../containers.scss";
import "../create-lesson/index.scss";
import InsertMedia from "../insert-media";
import Flex from "../flex";

export default function DescAuthoring(): JSX.Element {
  const [title, setTitle] = useState("");
  const [iconUrl, setIconUrl] = useState<string | undefined>(undefined);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

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

  const insertUrl = (image: string, index: number) => {
    const arr = [...imageUrls];
    console.log(arr, imageUrls);
    arr.splice(index, 1, image);
    console.log(arr);
    setImageUrls(arr);
  };

  const datekey = new Date().getTime();

  return (
    <div className="inner desc-authoring-grid">
      <Flex style={{ gridArea: "icon" }}>
        <div className="container-with-desc">
          <div>Icon</div>
          <InsertMedia
            imgUrl={iconUrl}
            style={{ width: "32px", height: "32px" }}
            callback={setIconUrl}
          />
        </div>
      </Flex>
      <Flex style={{ gridArea: "title" }}>
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
      <Flex style={{ gridArea: "purpose" }}>
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
      <Flex style={{ gridArea: "tags" }}>
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
      <Flex style={{ gridArea: "media" }}>
        <div className="container-with-desc">
          <div>Example Media</div>
          <div className="insert-images-div">
            {[...imageUrls, undefined].map((url, i) => (
              <InsertMedia
                // eslint-disable-next-line react/no-array-index-key
                key={`insert-desc-${datekey}-${i}`}
                imgUrl={url}
                style={{ width: "100%", height: "125px" }}
                callback={(str) => {
                  insertUrl(str, i);
                }}
              />
            ))}
          </div>
        </div>
      </Flex>
    </div>
  );
}
