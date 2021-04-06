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
import Empty from "../../../../../assets/images/trello/empty.png"
// import TrelloLogo from "../../../../../assets/images/trello/trello-logo.png"
// import Users from "../../../../../assets/images/trello/users.png"
// import Briefcase from "../../../../../assets/images/trello/briefcase.png"

export default function NotiModal() {

  const dispatch = useDispatch()

  const showNotiModal = useSelector((state: AppState) => state.trello.showNotiModal);


  const expand = useSpring({
    from: { right: showNotiModal ? "-600px" : "10px" },
    to: { right: showNotiModal ? "10px" : "-600px" },
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
      type: "SET_SHOW_NOTI_MODAL",
      arg: false,
    });

  };

  const handleClickItem = ()=>{
    reduxAction(dispatch, {
      type: "SET_SHOW_NOTI_MODAL",
      arg: false,
    });
  }
 

  return (
    <animated.div className="modalContainerNoti" style={{ ...expand }}>
      <div className="modalHeader">
        <div className="modalTitle">
          Notifications
        </div>
        <div className="modalClosebtn" onClick={() => { handleClick() }}>
          <img src={CloseIcon} />
        </div>
      </div>
      <div className="modalBody">
        <div>
          <button type="button" style={{color: 'white', cursor:'pointer', textDecoration:'underline'}}>View All</button>  
        </div>
      
        <div style={{marginBottom: '50px'}}>
          <img src={Empty} width="200px" draggable="false" style={{margin: '40px 100px', }}/>
          
          <div style={{textAlign:'center'}}>
            No Unread Notifications
          </div>
        </div>
        

        <div className="buttonItem" onClick={()=>handleClickItem()}>
          <div className="itemTitleRow">
            {/* <img src={Briefcase}/> */}
            <div>Change Email Notification Frequency</div>
          </div>          
        </div>
        <div className="buttonItem" onClick={()=>handleClickItem()}>
          <div className="itemTitleRow">
            {/* <img src={Briefcase}/> */}
            <div>Allow Notification</div>
          </div>          
        </div>

      
      </div>

    </animated.div>
  );
}

