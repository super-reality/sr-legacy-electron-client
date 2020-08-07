import React from 'react';
import "./index.scss";
import { ReactComponent as SearchIcon } from "../../../assets/svg/search.svg";

export default function InnerSearch(): JSX.Element {
  return (
    <div className="inner-search-container">
      <input className="inner-input" />
      <SearchIcon style={{margin: "auto"}} width="20px" height="20px" fill="var(--color-text)" />
    </div>
  );
}
