import React, { useCallback, useState } from "react";
import "./index.scss";

export default function Loading() {
  return (
    <div className="loader-container">
      <div className="spinner">
        <div className="rect1" />
        <div className="rect2" />
        <div className="rect3" />
        <div className="rect4" />
        <div className="rect5" />
      </div>
    </div>
  );
}
