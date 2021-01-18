/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { useDropzone } from "react-dropzone";
import { InputProps } from "..";
/* import icon from "../../../../assets/svg/image-icon.svg"; */
import close from "../../../../assets/svg/close-img.svg";
import "./index.scss";

const _fileProperties = [
  "lastModified",
  "lastModifiedDate",
  "name",
  "path",
  "preview",
  "size",
  "type",
  "webkitRelativePath",
];
export default function DropFile(props: InputProps): JSX.Element {
  const { setFieldValue, name, values } = props;
  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (accepted) => {
      if (accepted.length === 0) {
        return;
      }

      /*   const fileBlob:any= accepted[0];
      const newFile:any={};
      _fileProperties.forEach((key) => {
        newFile[key] = fileBlob[key];
      }); */

      const images: any = [];

      accepted.forEach((file) => {
        images.push({
          lastModified: file.lastModified,
          name: file.name,
          path: file.path,
          size: file.size,
          type: file.type,
        });
      });

      console.log(accepted);
      setFieldValue(name, values[name].concat(images));
    },
  });

  const removeImg = (index: number) => {
    const a = [...values[name]];
    a.splice(index, 1);
    setFieldValue(name, a);
  };

  const files = values[name].map((file: any, index: number) => {
    return (
      <li key={file.path}>
        <div>
          <img src={file.path} alt="lol23" />
          
            <div>
              <p>{file.name}</p>
              <img
                className="close"
                onClick={() => {
                  removeImg(index);
                }}
                src={close}
                alt="lol"
            />
            </div>
          
        </div>
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
        })}>
        <input name={name} {...getInputProps()} />
        <p>
          {isDragActive
            ? "drop your images here"
            : "drag or upload request images"}
        </p>
      </div>
      {values[name].length > 0 && (
        <aside className="droplist">
          <h4>{name}</h4>
          <ul>{files}</ul>
        </aside>
      )}
    </section>
  );
}
