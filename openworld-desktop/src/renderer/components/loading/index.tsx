import React, { useCallback, useState } from "react";
import "./index.scss";

export default function Loading() {
  return (
    <div className="loader-container">
      <div className="loader" />
    </div>
  );
}
