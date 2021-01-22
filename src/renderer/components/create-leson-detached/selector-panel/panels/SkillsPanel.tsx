import React from "react";
import useBasePanel from "../useBasePanel";

export default function SkillsPanel() {
  const Panel = useBasePanel("Skills and Achievements");

  return (
    <Panel>
      <div className="panel-wide" />
    </Panel>
  );
}
