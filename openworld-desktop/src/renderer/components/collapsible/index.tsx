import React, { PropsWithChildren, useState, useCallback } from 'react';
import "./index.scss";

interface CollapsibleProps {
  title: string;
}

export default function Collapsible(props: PropsWithChildren<CollapsibleProps>): JSX.Element {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  return (
    <>
    <div className="collapsible-box" onClick={toggleExpanded}>
      {props.title}
    </div>
    <div className={`collapsible-content ${expanded ? "expanded" : ""}`}>
      {props.children}
    </div>
    </>
  );
}
