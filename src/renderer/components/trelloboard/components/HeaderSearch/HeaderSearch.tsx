
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import React, { ChangeEvent, useState } from "react";

import './HeaderSearch.scss';
// import  from "../../../../../assets/svg/trello/"
// import { ReactComponent as SearchIcon } from "../../../../../assets/svg/trello/search-solid.svg";
import SearchIcon from "../../../../../assets/images/trello/search.png";

export default function HeaderSearch() {

  const [searchVal, setSearchVal] = useState('')
  
  const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
  }

  return (
    <div className="Header-Button Header-Board-Search">
      <input 
        className="Header-Board-Search-Input" 
        type="text" 
        autoComplete="off" 
        autoCorrect="off" 
        spellCheck="false" 
        value={searchVal}
        placeholder="Jump to..."
        onChange={handleChange}
      />
      
      {/* <div className="Header-Board-Search-Icon"> */}
        <img src={SearchIcon} className="Header-Board-Search-Icon"/>
      {/* </div> */}
      
    </div>
  );
}
