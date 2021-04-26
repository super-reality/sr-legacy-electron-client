import { CSSProperties, PropsWithChildren } from "react";
import "./index.scss";

interface ContainerWithCheckProps {
  checked: boolean;
  callback: (val: boolean) => void;
  style?: CSSProperties;
}

export default function ContainerWithCheck(
  props: PropsWithChildren<ContainerWithCheckProps>
) {
  const { children, checked, callback, style } = props;

  return (
    <div style={style} className="container-with-check">
      <div className="check-container">
        <div
          className={`check ${checked ? "checked" : ""}`}
          onClick={() => callback(!checked)}
        />
      </div>
      {children}
    </div>
  );
}
