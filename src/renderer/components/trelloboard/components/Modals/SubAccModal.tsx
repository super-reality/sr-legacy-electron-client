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



export default function SubAccModal() {

  const dispatch = useDispatch()

  const showSubAccModal = useSelector((state: AppState) => state.trello.showSubAccModal);
 

  const expand = useSpring({
    from: {
      left: showSubAccModal ? "250px" : "320px" ,
      opacity: showSubAccModal ? 0 : 1
    },
    to: {
      left: showSubAccModal ? "320px" : "250px" ,
      opacity: showSubAccModal ? 1 : 0
    },    
    onStart:()=>{
      const obj = document.getElementById('modalContainerAcc')
      if(obj != null){
        if(showSubAccModal){              
          obj.classList.remove('d-none')
        }
      }       
    },
    onRest:()=>{
      
      const obj = document.getElementById('modalContainerAcc')
      if(obj != null){
        if(!showSubAccModal){    
          obj.classList.add('d-none')        
        }
      }             
    }
  } as any);

  const handleClick = () => {
    // setisOpen(false)

    reduxAction(dispatch, {
      type: "SET_SHOW_SUB_ACC_MODAL",
      arg: false,
    });

  };

  const handleClickItem = ()=>{
    reduxAction(dispatch, {
      type: "SET_SHOW_SUB_ACC_MODAL",
      arg: false,
    });
  }
 

  return (
    <animated.div id="modalContainerAcc" className="modalContainerinvite d-none" style={{ ...expand }}>
      <div className="modalHeader">
        <div className="modalTitle">
          Account
        </div>
        <div className="modalClosebtn" onClick={() => { handleClick() }}>
          <img src={CloseIcon} />
        </div>
      </div>
      <div className="modalBody">
        <div className="profileRow">
          <div className="userNameAvatar">
            TE
          </div>
          <div className="profileRightSide ">
            <div>User Name Tester</div>
            <div>asdas@asd.com</div>
            <div className="buttonItem" onClick={()=>handleClickItem()}>
              <div className="itemTitleRow">            
                <div>Edit profile info</div>
              </div>          
            </div>
          </div>
        </div>
               

        <div className="buttonItem" onClick={()=>handleClickItem()}>
          <div className="itemTitleRow">            
            <div>Change permissions... (Admin)</div>
          </div>          
        </div>
        <div className="buttonItem" onClick={()=>handleClickItem()}>
          <div className="itemTitleRow">            
            <div>View member&apos;s board activity</div>
          </div>          
        </div>
        

      
      </div>

    </animated.div>
  );
}

