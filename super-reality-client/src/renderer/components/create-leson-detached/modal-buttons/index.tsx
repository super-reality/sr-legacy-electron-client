import React, { CSSProperties, useState } from "react";
import ButtonSimple from "../../button-simple";
import Flex from "../../flex";

interface ModalButtonsProps<T> {
  buttons: T[];
  initial: T;
  callback: (button: T) => void;
  height?: string;
  style?: CSSProperties;
}

export default function ModalButtons<T extends string>(
  props: ModalButtonsProps<T>
): JSX.Element {
  const { buttons, initial, callback, height, style } = props;
  const [value, setValue] = useState<T>(initial);

  return (
    <Flex style={{ justifyContent: "space-between", ...style }}>
      {buttons.map((str) => {
        return (
          <ButtonSimple
            key={str}
            width={`calc(${Math.round(100 / buttons.length)}% - ${
              buttons.length * 8
            }px)`}
            height={height || "24px"}
            style={
              value == str
                ? {
                    backgroundColor: "var(--color-background)",
                    color: "var(--color-text-active)",
                  }
                : {}
            }
            onClick={() => {
              setValue(str);
              callback(str);
            }}
          >
            {str}
          </ButtonSimple>
        );
      })}
    </Flex>
  );
}
