/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { useDropzone } from "react-dropzone";
import { InputProps } from "..";
import icon from "../../../../assets/svg/image-icon.svg";
import close from "../../../../assets/svg/close-img.svg";
import "./index.scss";

export default function DropFile(props: InputProps): JSX.Element {
  const { setFieldValue, name, values } = props;
  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (accepted) => {
      if (accepted.length === 0) {
        return;
      }
      setFieldValue("files", values.files.concat(accepted));
    },
  });

  const removeImg = (index: number) => {
    values.files.splice(index, 1);
    setFieldValue("files", values.files);
  };

  const files = values.files.map((file: any, index: number) => {
    return (
      <li key={file.path}>
        <img src={icon} alt="lol2" />
        {file.name}
        <img
          className="close"
          onClick={() => {
            removeImg(index);
          }}
          src={close}
          alt="lol"
        />
      </li>
    );
  });

  return (
    <section>
      <div
        {...getRootProps({
          className: `dropzone upload-image ${
            isDragActive && "upload-image-drag"
          }`,
        })}
      >
        <input name={name} {...getInputProps()} />
        <p>
          {isDragActive
            ? "drop your files here"
            : "drag or upload request images"}
        </p>
      </div>
      {values.files.length > 0 && (
        <aside className="droplist">
          <h4>Files</h4>
          <ul>{files}</ul>
        </aside>
      )}
    </section>
  );
}
