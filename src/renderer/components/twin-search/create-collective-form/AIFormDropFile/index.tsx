/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./index.scss";

interface DropProps {
  setFile: (file: string) => void;
  borderRadius: string;
  openEditor?: (open: boolean) => void;
  filePath?: string;
}

interface PreviewProps {
  filePath: string;
}

const Preview = (props: PreviewProps) => {
  const { filePath } = props;
  console.log(filePath);
  return <img className="drop-preview" src={filePath} />;
};

export default function AIFormDropFile(props: DropProps): JSX.Element {
  const { setFile, openEditor, filePath, borderRadius } = props;
  const [image, setImage] = useState<string>("");
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const {
    // acceptedFiles,
    isDragActive,
    getRootProps,
    getInputProps,
  } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length === 0) {
        return;
      }
      setFile(URL.createObjectURL(acceptedFiles[0]));
      //   setImage(acceptedFiles[0].path);
      setImage(URL.createObjectURL(acceptedFiles[0]));
      if (openEditor) {
        openEditor(true);
      }
      setIsEmpty(false);
    },
  });

  useEffect(() => {
    // URL.revokeObjectURL(image);
    if (filePath || image) {
      setIsEmpty(false);
    }
  }, [image, filePath]);

  return (
    <section style={{ borderRadius: borderRadius }}>
      <div
        {...getRootProps({
          className: `drop-file-avatar ${isDragActive && "drag-active"}`,
        })}
      >
        <Preview filePath={filePath || image} />
        <div className="drag -input">
          <input {...getInputProps()} />
          {isEmpty && (
            <p
              style={{
                fontSize: "0.8em",
                margin: "auto 1em",
                textAlign: "center",
              }}
            >
              {isDragActive
                ? "drop your avatar here"
                : "drag or upload avatar image"}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
