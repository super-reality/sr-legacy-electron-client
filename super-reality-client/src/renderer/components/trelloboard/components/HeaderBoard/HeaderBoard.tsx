import React from 'react';
import { useDispatch } from 'react-redux';
import reduxAction from "../../../../redux/reduxAction";
import "./HeaderBoard.scss";


import TrelloLogo from "../../../../../assets/images/trello/trello-logo.png";



export default function HeaderBoard() {

  const dispatch = useDispatch()

  const handleClick = () => {
   
    reduxAction(dispatch, {
      type: "SET_SHOW_BOARDMENU",
      arg: true,
    });
  };

  return (
    <div 
      className="Header-Button Header-Board-Button"
      tabIndex={0}
      onClick={ handleClick }
    >
      {/* <FontAwesomeIcon name="columns" className="Header-Board-Button-Icon" /> */}
      <img src={TrelloLogo} />
      <span className="Header-Board-Button-Text">Boards</span>
    </div>
  );
}

// HeaderBoard.propTypes = propTypes;
