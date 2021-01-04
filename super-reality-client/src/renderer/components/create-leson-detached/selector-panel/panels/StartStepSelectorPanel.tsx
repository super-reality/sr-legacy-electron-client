import React, { useCallback } from "react";
import "../index.scss";
import TypeIdSelectorPanel from "../TypeIdSelectorPanel";

interface CanvasSelectorPanelProps {
  stepId: string;
}

export default function CanvasSelectorPanel(props: CanvasSelectorPanelProps) {
  const { stepId } = props;

  const doUpdate = useCallback(
    (_val: any) => {
      // Should update the step with the update canvas key
    },
    [stepId]
  );

  return (
    <TypeIdSelectorPanel
      title="Start Step When"
      single={false}
      types={[
        "Image Found",
        "Video Found",
        "Process Found",
        "Text Found",
        "Object Found",
        "GPS Found",
      ]}
      baseData={[]}
      callback={doUpdate}
    />
  );
}
