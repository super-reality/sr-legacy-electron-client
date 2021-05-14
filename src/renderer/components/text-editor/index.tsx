import "./index.scss";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import "quill-paste-smart";

interface ITextEditor {
  onChange?: (e: string) => void;
  value?: string;
}

/* eslint-disable  react/jsx-props-no-spreading */
export default function useTextEditor(props: ITextEditor): JSX.Element {
  const { value, onChange } = props;

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      [
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "code-block",
        "link",
      ],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
        { align: "" },
        { align: "center" },
        { align: "right" },
        { align: "justify" },
      ],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
      allowed: {
        tags: ["br", "p"],
        attributes: [],
      },
      substituteBlockElements: true,
    },
  };
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "code-block",
    "align",
  ];

  return (
    <div data-text-editor="name">
      <ReactQuill
        style={{ height: "300px" }}
        modules={modules}
        {...(value ? { value: value } : {})}
        formats={formats}
        {...(onChange ? { onChange: (e) => onChange(e) } : {})}
        bounds={`[data-text-editor="name"]`}
      />
    </div>
  );
}
