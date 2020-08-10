import React, {
  PropsWithChildren,
  useState,
  useCallback,
  useEffect,
} from "react";
import "./index.scss";
import {ReactComponent as DropArrow} from "../../../assets/svg/drop.svg";
import {animated, useSpring} from "react-spring";
import {useMeasure} from "react-use";

interface CollapsibleProps {
  title: string;
  expanded?: boolean;
}

export default function Collapsible(
  props: PropsWithChildren<CollapsibleProps>
): JSX.Element {
  const [expanded, setExpanded] = useState(props.expanded ? true : false);
  const [overflow, setOverflow] = useState<"inherit" | "hidden">(props.expanded ? "inherit" : "hidden");

  const updateOverflow = useCallback(() => {
    setOverflow(expanded ? "inherit" : "hidden");
  }, [expanded]);

  const toggleExpanded = useCallback(() => {
    if (expanded) setOverflow("hidden");
    setExpanded(!expanded);
  }, [expanded]);

  const [contentHeight, setContentHeight] = useState(0);
  const [ref, {height}] = useMeasure<HTMLDivElement>();

  const expand = useSpring({
    from: {height: props.expanded ? `${contentHeight}px` : "0px"},
    onRest: updateOverflow,
    height: expanded ? `${contentHeight}px` : "0px",
  });

  useEffect(() => {
    setContentHeight(height);
  }, [height]);

  return (
    <>
      <div className="collapsible-box" onClick={toggleExpanded}>
        <div className={`icon-collapse ${expanded ? "open" : ""}`}>
          <DropArrow
            width="12.4px"
            height="8px"
            fill="var(--color-background)"
          />
        </div>
        <div style={{marginLeft: "8px"}}>{props.title}</div>
      </div>
      <animated.div
        style={{...expand, overflow}}
        className={`collapsible-content`}
      >
        <div ref={ref}>
          {props.children}
        </div>
      </animated.div>
    </>
  );
}
