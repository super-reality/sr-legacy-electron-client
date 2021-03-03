/* eslint-disable react/no-unused-prop-types */
import React from "react";
import "./index.scss";
import close from "../../../../../assets/svg/close-img.svg";
import { IFile } from "../../../../api/types/support-ticket/supportTicket";

interface IimagePreviewProps {
  values: IFile[];
  onRemove?: (i: number) => void;
  removable?: string;
  columns: number;
}

interface IimagePreviewStringProps {
  values: string[];
  columns: number;
}

function getImages(props: IimagePreviewProps): JSX.Element[] {
  const { values, onRemove, removable } = props;

  return values.map((file: IFile, index: number) => {
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

function getImagesString(props: IimagePreviewStringProps): JSX.Element[] {
  const { values } = props;

  return values.map((file) => {
    return (
      <li className="image-preview-item" key={file}>
        <div>
          <div className="image-preview-image">
            <a href={file}>
              <img src={file} alt="lol23" />
            </a>
          </div>
        </div>
      </li>
    );
  });
}

export function ImagesPreviewString(
  props: IimagePreviewStringProps
): JSX.Element {
  const { columns } = props;
  return (
    <ul
      className="image-preview-list"
      style={{ ["--columns" as string]: columns }}
    >
      {getImagesString(props)}
    </ul>
  );
}
