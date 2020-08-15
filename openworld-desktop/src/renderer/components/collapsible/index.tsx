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

interface CollapsibleProps {
  title: string;
  expanded?: boolean;
}

export default function Collapsible(
  props: PropsWithChildren<CollapsibleProps>
): JSX.Element {
  const { expanded, title, children } = props;

  const [open, setOpen] = useState(!!expanded);
  const [overflow, setOverflow] = useState<"inherit" | "hidden">(
    expanded ? "inherit" : "hidden"
  );

  const updateOverflow = useCallback(() => {
    setOverflow(open ? "inherit" : "hidden");
  }, [open]);

  const toggleopen = useCallback(() => {
    if (open) setOverflow("hidden");
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
      <div className="collapsible-box" onClick={toggleopen}>
        <div className={`icon-collapse ${open ? "open" : ""}`}>
          <DropArrow width="12.4px" height="8px" fill="var(--color-icon)" />
        </div>
        <div style={{ marginLeft: "8px" }}>{title}</div>
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
