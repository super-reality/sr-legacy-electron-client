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
// import Empty from "../../../../../assets/images/trello/empty.png"



import InfoTemp from "../../../../../assets/images/trello/info-temp.png"
// import Users from "../../../../../assets/images/trello/users.png"
// import Briefcase from "../../../../../assets/images/trello/briefcase.png"

export default function InfoModal() {

  const dispatch = useDispatch()

  const showInfoModal = useSelector((state: AppState) => state.trello.showInfoModal);


  const expand = useSpring({
    from: { right: showInfoModal ? "-600px" : "10px" },
    to: { right: showInfoModal ? "10px" : "-600px" },
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
      type: "SET_SHOW_INFO_MODAL",
      arg: false,
    });

  };

  const handleClickItem = ()=>{
    reduxAction(dispatch, {
      type: "SET_SHOW_INFO_MODAL",
      arg: false,
    });
  }
 

  return (
    <animated.div className="modalContainerNoti" style={{ ...expand }}>
      <div className="modalHeader">
        <div className="modalTitle">
          Information
        </div>
        <div className="modalClosebtn" onClick={() => { handleClick() }}>
          <img src={CloseIcon} />
        </div>
      </div>
      <div className="modalBody">
        
        <div style={{marginBottom: '50px'}}>
          <img src={InfoTemp} width="200px" draggable="false" style={{margin: '40px 100px', }}/>
          
          <div style={{textAlign:'center'}}>
            Get inspired by dozens of different Trello workflows
          </div>
          {/* <div style={{textAlign:'center'}}>
            <button type="button" style={{color: 'white', cursor:'pointer', textDecoration:'underline'}}>Get a new tip</button>  
          </div> */}
        </div>
        
        

        <div className="buttonItem" onClick={()=>handleClickItem()}>
          <div className="itemTitleRowCenter">            
            <div>Get a new tip</div>
          </div>          
        </div>
        {/* <div className="buttonItem" onClick={()=>handleClickItem()}>
          <div className="itemTitleRow">
            
            <div>Allow Notification</div>
          </div>          
        </div> */}

      
      </div>

    </animated.div>
  );
}

