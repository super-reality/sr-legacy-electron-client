import React from "react";
import ButtonSimple from "../../button-simple";

interface ButtonCheckboxProps {
  text: string;
  check: boolean;
  showDisabled?: boolean;
  margin?: string;
  width?: string;
  height?: string;
  onButtonClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onCheckClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export default function ButtonCheckbox(props: ButtonCheckboxProps) {
  const {
    text,
    check,
    showDisabled,
    margin,
    width,
    height,
    onButtonClick,
    onCheckClick,
  } = props;

  return (
    <ButtonSimple
      width={width ?? "165px"}
      height={height ?? "24px"}
      margin={margin ?? ""}
      style={{ justifyContent: "space-between" }}
      onClick={onButtonClick}
    >
      <div>{text}</div>
      {check || showDisabled ? (
        <div
          onClick={onCheckClick}
          className={check ? "button-checked" : "button-unchecked"}
        />
      ) : (
        <></>
      )}
    </ButtonSimple>
  );
}
