import { CSSProperties, useState } from "react";
import ButtonSimple from "../../button-simple";
import Flex from "../../flex";

interface ModalButtonsProps<T> {
  buttons: T[];
  initial: T;
  callback: (button: T) => void;
  height?: string;
  style?: CSSProperties;
  icons?: React.FunctionComponent<any>[];
}

export default function ModalButtons<T extends string>(
  props: ModalButtonsProps<T>
): JSX.Element {
  const { buttons, initial, callback, height, style, icons } = props;
  const [value, setValue] = useState<T>(initial);

  return (
    <Flex style={{ justifyContent: "space-between", ...style }}>
      {buttons.map((str, i) => {
        const Icon = icons ? icons[i] : undefined;
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
            {Icon ? (
              <Icon
                fill={
                  value == str
                    ? "var(--color-text-active)"
                    : "var(--color-icon)"
                }
              />
            ) : (
              str
            )}
          </ButtonSimple>
        );
      })}
    </Flex>
  );
}
