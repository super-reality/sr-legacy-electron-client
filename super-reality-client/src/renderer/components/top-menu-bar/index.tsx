import React from "react";
import "./index.scss";

const menues = ["Create", "Library", "Store", "Help", "Open Source"];

export default function TopMenuBar() {
  return (
    <div className="top-menu-container">
      <div className="top-menu-logo" />
      {menues.map((str) => (
        <div className="top-menu-item" key={`top-bar-menu-${str}`}>
          {str}
        </div>
      ))}
    </div>
  );
}
