import React, { CSSProperties, useCallback, useState } from "react";
import { ReactComponent as Add } from "../../../assets/svg/add.svg";
import "./index.scss";
import useMediaSniper from "../../hooks/useMediaSniper";
import useMediaInsert from "../../hooks/useMediaInsert";
import Select from "../select";

const CVFnOptions = ["on", "off"];
const CVFConditionOptions = ["and", "or", "ignore"];
interface InsertStepMediaProps {
  callback: (url: string) => void;
  imgUrl?: string;
  style?: CSSProperties;
  snip?: boolean;
  isCVOn?: boolean;
}

export default function InsertStepMedia(
  props: InsertStepMediaProps
): JSX.Element {
  const { callback, imgUrl, style, snip, isCVOn } = props;

  const openSnipTool = snip
    ? useMediaSniper(imgUrl, callback)
    : useMediaInsert(callback);

  const [CVFn, SetCVFn] = useState(CVFnOptions[0]);
  const [CVFCondition, SetCVFCondition] = useState(CVFConditionOptions[0]);

  return (
    <div>
      {isCVOn ? (
        <Select
          options={CVFnOptions}
          current={CVFn}
          callback={SetCVFn}
          style={{ marginBottom: 10 }}
        />
      ) : (
        <Select
          options={CVFConditionOptions}
          current={CVFCondition}
          callback={SetCVFCondition}
          style={{ marginBottom: 10 }}
        />
      )}
      <div
        className="insert-media-container"
        style={{
          ...style,
          backgroundImage: `url(${imgUrl})`,
        }}
        onClick={openSnipTool}
      >
        {imgUrl ? undefined : (
          <Add
            style={{ margin: "auto" }}
            fill="var(--color-text)"
            width="16px"
            height="16px"
          />
        )}
      </div>
    </div>
  );
}
