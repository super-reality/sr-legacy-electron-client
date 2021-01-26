import React from "react";
import useBasePanel from "../useBasePanel";

import { ReactComponent as IconAlert } from "../../../../../assets/svg/alerts.svg";

export default function AlertsPanel() {
  const Panel = useBasePanel("Alerts", IconAlert, {});

  return (
    <Panel>
      <div className="panel-wide" />
    </Panel>
  );
}
