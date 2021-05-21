import { CSSProperties, useEffect, useRef, useState } from "react";
import { animated, useSpring } from "react-spring";
import {
  onTextChange,
  handleEnterDown,
} from "../../utils/chat-utils/common-functions";
import useDetectOutsideClick from "./useDetectOutsideClick";

interface ParamsType {
  callback: (text: string) => void;
  fromStyle?: CSSProperties;
  toStyle?: CSSProperties;
}
/*
{fromStyle?: CSSProperties,
  toStyle?: CSSProperties} */
interface InputElementProps {
  inputClass: string;
  placeholder: string;
}
export default function useInputOverlaying(
  params: ParamsType
): [(props: InputElementProps) => JSX.Element, () => void] {
  const { callback, fromStyle, toStyle } = params;
  const [edit, setEdit] = useState<boolean>(false);
  const [text, setText] = useState<string>("");

  const openInput = () => {
    setEdit(true);
  };
  const submitEditText = () => {
    setEdit(false);
    callback(text);
    console.log(text);
    setText("");
  };
  // animation props
  const defaultFromStyle = {
    opacity: 0,
    width: "0%",
    right: "50%",
    zIndex: 1,
    boxShadow: "0 7px 10px rgba(0, 0, 0, 0.24)",
  };
  const defaultToStyle = {
    opacity: 1,
    width: "70%",
    right: "20%",
  };

  const from = fromStyle
    ? { ...defaultFromStyle, ...params.fromStyle }
    : defaultFromStyle;

  const to = toStyle
    ? { ...defaultToStyle, ...params.toStyle }
    : defaultToStyle;

  const [inputProps, inputApi] = useSpring(
    {
      config: { mass: 4, tension: 1500, friction: 180 },
      from: from,
    },
    [edit]
  );
  useEffect(() => {
    if (edit) {
      inputApi.start({ to: to } as any);
    } else {
      inputApi.start({ to: from } as any);
    }
    console.log(edit, from, to);
  }, [edit]);

  const InputElement = (props: InputElementProps): JSX.Element => {
    const { inputClass, placeholder } = props;
    const inputRef = useRef<HTMLDivElement | null>(null);
    useDetectOutsideClick(inputRef, () => setEdit(false));
    console.log(text);
    return (
      <animated.div ref={inputRef} className={inputClass} style={inputProps}>
        <div className="input-hook-wrapper">
          <input
            autoFocus={edit}
            style={{
              textAlign: "center",
            }}
            value={text}
            type={text}
            placeholder={placeholder}
            onChange={(e) => {
              onTextChange(e, setText);
            }}
            onKeyDown={(e) => {
              handleEnterDown(e, submitEditText);
            }}
          />
        </div>
      </animated.div>
    );
  };
  return [InputElement, openInput];
}
/* <Input
            text={text}
            setEdit={() => setEdit(false)}
            setText={setText}
            submitEditText={submitEditText}
          /> */
