import React from "react";
import "./index.scss";
import { ReactComponent as SearchIcon } from "../../../assets/svg/search.svg";

export default function InnerSearch(): JSX.Element {
  return (
    <div className="inner-search-container">
      <input className="inner-input" />
      <div style={{ margin: "auto", width: "16px", height: "16px" }}>
        <SearchIcon width="16px" height="16px" fill="var(--color-text)" />
      </div>
    </div>
  );
}
