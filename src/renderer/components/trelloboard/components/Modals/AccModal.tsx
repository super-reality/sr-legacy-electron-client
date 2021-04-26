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


const mainItems =[
  {
    title: 'Profile and visibility',    
  },
  {
    title: 'Activity',    
  },
  {
    title: 'Cards',    
  },
  {
    title: 'Settings',    
  },
]
const helps = [
  {
    title: 'Help',    
  },
  {
    title: 'Shortcuts',    
  },
]


export default function AccModal() {

  const dispatch = useDispatch()

  const showAccModal = useSelector((state: AppState) => state.trello.showAccModal);


  const expand = useSpring({
    from: { right: showAccModal ? "-600px" : "80px" },
    to: { right: showAccModal ? "80px" : "-600px" },
    onRest: () => {
      console.log('')
    }
  });

  const handleClick = () => {
    // setisOpen(false)

    reduxAction(dispatch, {
      type: "SET_SHOW_ACC_MODAL",
      arg: false,
    });

  };

  const handleClickItem = ()=>{
    reduxAction(dispatch, {
      type: "SET_SHOW_ACC_MODAL",
      arg: false,
    });
  }
 

  return (
    <animated.div className="modalContainerAcc" style={{ ...expand }}>
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
          <div className="profileRightSide">
            <div>User Name Tester</div>
            <div>asdas@asd.com</div>
          </div>
        </div>
        
        <div className="divider"/>

        {
          mainItems.map((one, key)=>{
            const index = key +1;
            return (
              <div key={index} className="buttonItem" onClick={()=>handleClickItem()}>
                <div className="itemTitleRow">            
                  <div>{one.title}</div>
                </div>          
              </div>
            )
          })          
        }
       <div className="divider"/>
        {
          helps.map((one, key)=>{
            const index = key +1;
            return (              
              <div key={index} className="buttonItem" onClick={()=>handleClickItem()}>
                <div className="itemTitleRow">            
                  <div>{one.title}</div>
                </div>          
              </div>
            )
          })          
        }
        <div className="divider"/>
        <div className="buttonItem" onClick={()=>handleClickItem()}>
          <div className="itemTitleRow">            
            <div>Log out</div>
          </div>          
        </div>

      
      </div>

    </animated.div>
  );
}

