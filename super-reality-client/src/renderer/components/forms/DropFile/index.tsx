/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { useDropzone } from "react-dropzone";
import { InputProps } from "..";
/* import icon from "../../../../assets/svg/image-icon.svg"; */
/* import close from "../../../../assets/svg/close-img.svg"; */
import ImagesPreview from "./ImagePreview";
import "./index.scss";

export interface Iimages {
  lastModified: number;
  name: string;
  path: string;
  size: number;
  type: string;
}

export default function DropFile(props: InputProps): JSX.Element {
  const { setFieldValue, name, values } = props;
  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (accepted) => {
      if (accepted.length === 0) {
        return;
      }
      const images: Iimages[] = [];

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
            ? "drop your images here"
            : "drag or upload request images"}
        </p>
      </div>
      {values[name].length > 0 && (
        <aside className="droplist">
          <h4>{name}</h4>
          <ImagesPreview
            values={values[name]}
            removable="true"
            columns={2}
            onRemove={removeImg}
          />
        </aside>
      )}
    </section>
  );
}
