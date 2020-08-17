import React, { useCallback, useState, useEffect, useMemo } from "react";
import "./index.scss";
import "../containers.scss";
import "../create-lesson/index.scss";
import InsertMedia from "../insert-media";
import Flex from "../flex";

export default function MediAuthoring(): JSX.Element {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const insertUrl = (image: string, index: number) => {
    const arr = [...imageUrls];
    console.log(arr, imageUrls);
    arr.splice(index, 1, image);
    console.log(arr);
    setImageUrls(arr);
  };

  const datekey = new Date().getTime();

  return (
    <Flex style={{ gridArea: "media" }}>
      <div className="container-with-desc">
        <div>Add Media</div>
        <Flex style={{ flexDirection: "column" }}>
          {[...imageUrls, undefined].map((url, i) => (
            <InsertMedia
              // eslint-disable-next-line react/no-array-index-key
              key={`insert-media-${datekey}-${i}`}
              imgUrl={url}
              style={{
                marginBottom: "8px",
                width: "100%",
                height: url ? "200px" : "auto",
              }}
              callback={(str) => {
                insertUrl(str, i);
              }}
            />
          ))}
        </Flex>
      </div>
    </Flex>
  );
}
