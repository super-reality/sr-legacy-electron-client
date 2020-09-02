import React, { CSSProperties, useEffect, useState, useCallback } from "react";
import Flex from "../flex";
import "../containers.scss";
import InsertMedia from "../insert-media";

interface BaseInsertMediaProps {
  urls: string[];
  title: string;
  style?: CSSProperties;
  callback: (url: string, index: number) => void;
}

export default function BaseInsertMedia(
  props: BaseInsertMediaProps
): JSX.Element {
  const { urls, title, style, callback } = props;
  const [urlList, setUrlList] = useState(urls);
  const call = useCallback(callback, [callback]);

  useEffect(() => {
    setUrlList(urls);
  }, [urls]);

  const datekey = new Date().getTime();
  return (
    <Flex style={style}>
      <div className="container-with-desc">
        <div>{title}</div>
        <Flex style={{ flexDirection: "column" }}>
          {[...urlList, undefined].map((url, i) => (
            <InsertMedia
              // eslint-disable-next-line react/no-array-index-key
              key={`insert-media-${datekey}-${i}`}
              imgUrl={url}
              style={{
                marginBottom: "8px",
                width: "100%",
              }}
              callback={(str) => {
                call(str, i);
              }}
            />
          ))}
        </Flex>
      </div>
    </Flex>
  );
}
