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
      title="Step Canvas"
      single
      types={[
        "Image",
        "Recording",
        "Process",
        "Facial Expression",
        "Browser",
        "GPS",
        "Body Pose",
        "Brainwave",
        "User",
        "Object",
        "Gaze",
        "Sound",
        "Smell",
        "Taste",
        "AI",
        "Organism",
        "Language",
      ]}
      baseData={[]}
      callback={doUpdate}
    />
  );
}
