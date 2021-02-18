import React, { useRef } from "react";
import { animated, useSpring } from "react-spring";
import { handleEnterDownEdit } from "../../utils/chat-utils/common-functions";
import useDetectOutsideClick from "./useDetectOutsideClick";
import useTextInput from "./useTextInput";

export default function useAnimatedInput(
  isEdit: boolean,
  initialValue: string,
  submitFunc: (value: string) => void,
  closeFunc: () => void
): JSX.Element {
  // call hook to handle the onChange input event with initial value
  const [value, onChangeHandler] = useTextInput(initialValue);
  const submit = () => {
    submitFunc(value);
  };

  const inputRef = useRef<HTMLInputElement>(null);
  // activate the outside element click hook
  useDetectOutsideClick(inputRef, closeFunc);
  const nameProps = useSpring({
    config: { mass: 4, tension: 1500, friction: 180 },
    opacity: isEdit ? 1 : 0,
    width: isEdit ? "70%" : "0%",
    right: isEdit ? "20%" : "50%",
    zIndex: 1,
    position: "absolute",
    top: "8%",
    boxShadow: "0 7px 10px rgba(0, 0, 0, 0.24)",
  } as any);

  return (
    <animated.div style={nameProps}>
      <div className="category-input">
        <input
          ref={inputRef}
          style={{
            textAlign: "center",
          }}
          value={value}
          type="text"
          placeholder="Category Name"
          onChange={onChangeHandler}
          onKeyDown={(e) => {
            handleEnterDownEdit(e, submit);
          }}
        />
      </div>
    </animated.div>
  );
}
