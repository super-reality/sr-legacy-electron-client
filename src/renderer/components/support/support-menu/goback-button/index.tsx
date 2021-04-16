import "./index.scss";
import { CSSProperties } from "react";
import { ReactComponent as SupportIcon } from "../../../../../assets/svg/support-icon.svg";

interface IGobackButton {
  onClick: () => void;
  style?: CSSProperties;
}

export default function GoBackButton({
  onClick,
  style,
}: IGobackButton): JSX.Element {
  return (
    <div onClick={onClick} style={style} className="support-menu-goback">
      <SupportIcon />
      Back to main
    </div>
  );
}
