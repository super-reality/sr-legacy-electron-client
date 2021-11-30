import React from "react";

import {
  useSelector,
  useDispatch
} from "react-redux";
import { animated, useSpring } from "react-spring";

import reduxAction from "../../../../redux/reduxAction";
import {
  AppState
} from "../../../../redux/stores/renderer";

import "./Modal.scss";

import CloseIcon from "../../../../../assets/images/trello/close.png"
import TrelloLogo from "../../../../../assets/images/trello/trello-logo.png"
import Users from "../../../../../assets/images/trello/users.png"
import Briefcase from "../../../../../assets/images/trello/briefcase.png"

export default function CreateModal() {

  const dispatch = useDispatch()

  const showCreateModal = useSelector((state: AppState) => state.trello.showCreateModal);


  const expand = useSpring({
    from: { right: showCreateModal ? "-400px" : "20px" },
    to: { right: showCreateModal ? "20px" : "-400px" },
    onRest: () => {
      // if(!isOpen){
      // 	reduxAction(dispatch, {
      // 		type: "SET_SHOW_BOARDMENU",
      // 		arg: false,
      // 	});
      // }
    }
  });

  const handleClick = () => {
    // setisOpen(false)

    reduxAction(dispatch, {
      type: "SET_SHOW_CREATE_MODAL",
      arg: false,
    });

  };

  const handleClickItem = ()=>{
    reduxAction(dispatch, {
      type: "SET_SHOW_CREATE_MODAL",
      arg: false,
    });
  }

  const handleCreate = ()=>{
    reduxAction(dispatch, {
      type: "SET_SHOW_ADD_BOARD_MODAL",
      arg: true,
    });
    reduxAction(dispatch, {
      type: "SET_SHOW_CREATE_MODAL",
      arg: false,
    });
  }
 

  return (
    <animated.div className="modalContainer" style={{ ...expand }}>
      <div className="modalHeader">
        <div className="modalTitle">
          Create
        </div>
        <div className="modalClosebtn" onClick={() => { handleClick() }}>
          <img src={CloseIcon} />
        </div>
      </div>
      <div className="modalBody">

        <div className="buttonItem" onClick={()=>handleCreate()}>
          <div className="itemTitleRow">
            <img src={TrelloLogo}/>
            <div>Create board</div>
          </div>
          
          <p>
            A board is made up of cards ordered on lists. Use it to manage projects, track information, or organize anything.
          </p>
        </div>
        {/* <div className="buttonItem" onClick={()=>handleClickItem()}>
          <div className="itemTitleRow">
            <img src={Users}/>
            <div>Create team</div>
          </div>
          
          <p>
          A team is a group of boards and people. Use it to organize your company, side hustle, family, or friends.

          </p>
        </div>
        <div className="buttonItem" onClick={()=>handleClickItem()}>
          <div className="itemTitleRow">
            <img src={Briefcase}/>
            <div>Create business team</div>
          </div>
          
          <p>
          With Business Class your team has more security, administrative controls, and unlimited Power-Ups.

          </p>
        </div>

       */}




      </div>

    </animated.div>
  );
}

