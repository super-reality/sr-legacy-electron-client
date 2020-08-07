import React, {PropsWithChildren, useState, useCallback} from "react";
import "./index.scss";
import { ReactComponent as DropArrow } from "../../../assets/svg/drop.svg";

interface CollapsibleProps {
  title: string;
}

export default function Collapsible(
  props: PropsWithChildren<CollapsibleProps>
): JSX.Element {
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  return (
    <>
      <div className="collapsible-box" onClick={toggleExpanded}>
        <div className={`icon-collapse ${expanded ? "open" : ""}`}>
          <DropArrow width="12.4px" height="8px" fill="var(--color-background)" />
        </div>
        <div style={{marginLeft: "8px"}}>
          {props.title}
        </div>
      </div>
      <div className={`collapsible-content ${expanded ? "expanded" : ""}`}>
        {props.children}
      </div>
    </>
  );
}
