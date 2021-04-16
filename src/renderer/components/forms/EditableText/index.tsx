import "./index.scss";
import { useState } from "react";
import InputText from "../InputText";
import { InputProps } from "..";
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-eval */
/* interface IEditableTextProps {
    text:string;
    type:string;
    placeholder:string;
    children:ReactNode;
} */

export default function EditableText(props: InputProps): JSX.Element {
  const { placeholder, secondaryName } = props;

  const [isEditing, setEditing] = useState(false);
  /*
  const handleKeyDown = (event, type) => {
    // Handle when key is pressed
  }; */

  return (
    <section {...props}>
      {isEditing ? (
        <div
          onBlur={() => setEditing(false)}
          /*  onKeyDown={(e) => handleKeyDown(e, type)} */
        >
          <InputText {...props} />
        </div>
      ) : (
        <div onClick={() => setEditing(true)}>
          <span>{secondaryName || placeholder || "Editable content"}</span>
        </div>
      )}
    </section>
  );
}
