import React from "react";
import useBasePanel from "../useBasePanel";

export default function AlertsPanel() {
  const Panel = useBasePanel("Alerts");

  return (
    <Panel>
      <div className="panel-wide" />
    </Panel>
  );
}
