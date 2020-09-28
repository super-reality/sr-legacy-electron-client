import React, {
  PropsWithChildren,
  useState,
  useCallback,
  useEffect,
} from "react";
import "./index.scss";
import { animated, useSpring } from "react-spring";
import { useMeasure } from "react-use";
import { ReactComponent as DropArrow } from "../../../assets/svg/drop.svg";
import { ReactComponent as DetachIcon } from "../../../assets/svg/detach.svg";

interface CollapsibleProps {
  title: string;
  outer?: boolean;
  detach?: () => void;
  id?: string;
  expanded?: boolean;
}

export default function Collapsible(
  props: PropsWithChildren<CollapsibleProps>
): JSX.Element {
  const { id, outer, title, children, detach } = props;
  let { expanded } = props;

  const localId = `collapsible-${id || title}`;
  if (window.localStorage.getItem(localId) !== null) {
    expanded = window.localStorage.getItem(localId) == "true";
  }

  const [open, setOpen] = useState(!!expanded);
  const [overflow, setOverflow] = useState<"visible" | "hidden">(
    expanded ? "visible" : "hidden"
  );

  const updateOverflow = useCallback(() => {
    setOverflow(open ? "visible" : "hidden");
  }, [open]);

  const toggleopen = useCallback(() => {
    if (open) setOverflow("hidden");
    setTimeout(() => {
      window.localStorage.setItem(localId, !open ? "true" : "false");
    }, 200);
    setOpen(!open);
  }, [open]);

  const [contentHeight, setContentHeight] = useState(0);
  const [ref, { height }] = useMeasure<HTMLDivElement>();

  const expand = useSpring({
    from: { height: expanded ? `${contentHeight}px` : "0px" },
    onRest: updateOverflow,
    height: open ? `${contentHeight}px` : "0px",
  });

  useEffect(() => {
    setContentHeight(height);
  }, [height]);

  return (
    <>
      <div
        className={`collapsible-box${outer ? "-outer" : ""}`}
        key={localId}
        onClick={toggleopen}
      >
        <div className={`icon-collapse ${open ? "open" : ""}`}>
          <DropArrow width="12.4px" height="8px" fill="var(--color-icon)" />
        </div>
        <div style={{ marginLeft: "8px" }}>{title}</div>
        {detach ? (
          <div
            className="icon-detach"
            onClick={(e) => {
              e.stopPropagation();
              detach();
            }}
          >
            <DetachIcon
              style={{ margin: "auto", width: "14px", height: "14px" }}
              fill="var(--color-icon)"
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      <animated.div
        style={{ ...expand, overflow }}
        className="collapsible-content"
      >
        <div style={{ display: "flex", flexDirection: "column" }} ref={ref}>
          {children}
        </div>
      </animated.div>
    </>
  );
}
