import React from "react";
import "./index.scss";
import close from "../../../../../assets/svg/close-img.svg";
import { Iimages } from "..";

interface IimagePreviewProps {
  values: Iimages[];
  onRemove?: (i: number) => void;
  removable?: string;
  columns: number;
}

function getImages(props: IimagePreviewProps): JSX.Element[] {
  const { values, onRemove, removable } = props;

  return values.map((file: Iimages, index: number) => {
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
                onClick={() => onRemove && onRemove(index)}
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

export default function ImagesPreview(props: IimagePreviewProps): JSX.Element {
  const { columns } = props;
  return (
    <ul
      className="image-preview-list"
      style={{ ["--columns" as string]: columns }}
    >
      {getImages(props)}
    </ul>
  );
}
