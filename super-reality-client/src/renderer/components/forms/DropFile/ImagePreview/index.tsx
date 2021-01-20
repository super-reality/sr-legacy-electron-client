import React from "react";
import "./index.scss";
import close from "../../../../../assets/svg/close-img.svg";

interface IimagePreviewProps {
  values: any[];
  onRemove?: (i: number) => void;
  removable: string;
  columns: number;
}

function getImages(values: any, onRemove: any, removable: string): JSX.Element {
  return values.map((file: any, index: number) => {
    return (
      <li className="image-preview-item" key={file.path}>
        <div>
          <div className="image-preview-image">
            <img src={file.path} alt="lol23" />
          </div>
          <div className="image-preview-text">
            <p>{file.name}</p>
            {removable === "true" && (
              <img
                className="close"
                onClick={() => onRemove(index)}
                src={close}
                alt="lol"
              />
            )}
          </div>
        </div>
      </li>
    );
  });
}

export default function ImagesPreview({
  values,
  onRemove,
  removable,
  columns,
}: IimagePreviewProps): JSX.Element {
  return (
    <ul
      className="image-preview-list"
      style={{ ["--columns" as string]: columns }}
    >
      {getImages(values, onRemove, removable)}
    </ul>
  );
}
