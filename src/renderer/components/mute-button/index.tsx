import { CSSProperties, useMemo } from "react";
import "../buttons.scss";

import { ReactComponent as MuteIcon } from "../../../assets/svg/mute.svg";
import { ReactComponent as UnMuteIcon } from "../../../assets/svg/unmute.svg";

interface EditProps {
  style?: CSSProperties;
  state: boolean;
  callback?: () => void;
}

export default function MuteButton(props: EditProps): JSX.Element {
  const { style, state, callback } = props;

  const Icon = useMemo(() => (state ? UnMuteIcon : MuteIcon), [state]);

  return (
    <div
      className="icon-button"
      style={{
        margin: "8px",
        display: "flex",
        ...style,
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (callback) callback();
      }}
    >
      <Icon
        width="20px"
        height="20px"
        fill="var(--color-icon)"
        style={{ margin: "auto" }}
      />
    </div>
  );
}
