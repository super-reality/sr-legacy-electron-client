import React from 'react';
import "./index.scss";
import { ReactComponent as SearchIcon } from "../../../assets/svg/search.svg";

export default function TopSearch(): JSX.Element {
  return (
    <div className="top-input-container">
      <input className="top-input" />
      <SearchIcon style={{margin: "auto 8px"}} width="20px" height="20px" fill="var(--color-text)" />
    </div>
  );
}
