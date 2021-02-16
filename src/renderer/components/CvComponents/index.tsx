import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/stores/renderer";

export default function CvComponents() {
  const { cvCanvas } = useSelector((state: AppState) => state.settings.cv);
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <canvas
        style={{ width: "600px", height: "auto", margin: "0 auto" }}
        id="canvasOutput"
        ref={canvasEl}
        width={cvCanvas}
        height={cvCanvas}
      />
      <canvas
        id="canvasTestOutput"
        style={{ width: "600px", height: "auto", margin: "0 auto" }}
      />
    </div>
  );
}
