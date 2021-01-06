import React from "react";
import "./index.scss";

interface ImageCheckboxProps {
  image: string;
  check: boolean;
  showDisabled?: boolean;
  margin?: string;
  width?: string;
  height?: string;
  onButtonClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onCheckClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export default function ImageCheckbox(props: ImageCheckboxProps) {
  const {
    image,
    check,
    showDisabled,
    margin,
    width,
    height,
    onButtonClick,
    onCheckClick,
  } = props;

  return (
    <div
      className="image-checkbox"
      style={{
        width: width ?? "200px",
        height: height ?? "120px",
        margin: margin ?? "8px auto",
      }}
      onClick={onButtonClick}
    >
      <img src={image} />
      {check || showDisabled ? (
        <div className="check-container">
          <div
            onClick={onCheckClick}
            className={check ? "check checked" : "check"}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
