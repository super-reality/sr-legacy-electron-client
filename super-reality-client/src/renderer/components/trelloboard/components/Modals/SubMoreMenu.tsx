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
import ConfirmModal from "./ConfirmModal";
import { closeBoard } from "../../../../api/trello/apis";


const mainItems =[
  {
    title: 'Settings',    
  },
  {
    title: 'Labels',    
  },
  {
    title: 'Archived items',    
  },
 
  
]
const menuItems1 = [
  {
    title: 'Copy board',    
  },
  {
    title: 'Print and export',    
  },
  {
    title: 'Close board',    
  }
]


export default function SubMoreMenu() {

  const dispatch = useDispatch()

  const showSubHeaderMoreMenu = useSelector((state: AppState) => state.trello.showSubHeaderMoreMenu);
  const boardData = useSelector((state: AppState) => state.trello.boardData);
  const [showConfirm, setShowConfirm] = React.useState(false)


  const expand = useSpring({
    from: { right: showSubHeaderMoreMenu ? "-600px" : "10px" },
    to: { right: showSubHeaderMoreMenu ? "10px" : "-600px" },
    onStart:()=>{
      const obj = document.getElementById('modalContainerSubMoreMenu')
      if(obj != null){
        if(showSubHeaderMoreMenu){              
          obj.classList.remove('d-none')
        }
      }       
    },
    onRest:()=>{
      
      const obj = document.getElementById('modalContainerSubMoreMenu')
      if(obj != null){
        if(!showSubHeaderMoreMenu){    
          obj.classList.add('d-none')        
        }
      }             
    }
  });

  const handleClick = () => {
    // setisOpen(false)

    reduxAction(dispatch, {
      type: "SET_SHOW_SUB_MORE_MENU",
      arg: false,
    });

  };

  const handleClickItem = (menuItem : any, _ : number)=>{
    reduxAction(dispatch, {
      type: "SET_SHOW_SUB_MORE_MENU",
      arg: false,
    });

    if(menuItem.title == "Close board"){
      setShowConfirm(true)
    }
  }
 
  const handleConfirmClose = async()=>{
    setShowConfirm(false)

    // todo remove board
    if(boardData){
      await closeBoard(boardData._id)
    }
    

  }
  const handleCloseCancel = ()=>{
    setShowConfirm(false)
  }

  return (
    <>
    <animated.div id="modalContainerSubMoreMenu" className="modalContainerSubMoreMenu d-none" style={{ ...expand }}>
      <div className="modalHeader">
        <div className="modalTitle">
          More
        </div>
        <div className="modalClosebtn" onClick={() => { handleClick() }}>
          <img src={CloseIcon} />
        </div>
      </div>
      <div className="modalBody">
        {/* <div className="profileRow">
          <div className="userNameAvatar">
            TE
          </div>
          <div className="profileRightSide">
            <div>User Name Tester</div>
            <div>asdas@asd.com</div>
          </div>
        </div>
        
        <div className="divider"/> */}

        {
          mainItems.map((one, key)=>{
            const index = key +1;
            return (
              <div key={index} className="buttonItem" onClick={()=>handleClickItem(one, key)}>
                <div className="itemTitleRow">            
                  <div>{one.title}</div>
                </div>          
              </div>
            )
          })          
        }
       <div className="divider"/>
        {
          menuItems1.map((one, key)=>{
            const index = key +1;
            return (              
              <div key={index} className="buttonItem" onClick={()=>handleClickItem(one, key)}>
                <div className="itemTitleRow">            
                  <div>{one.title}</div>
                </div>          
              </div>
            )
          })          
        }
        {/* <div className="divider"/>
        <div className="buttonItem" onClick={()=>handleClickItem()}>
          <div className="itemTitleRow">            
            <div>Log out</div>
          </div>          
        </div> */}

      
      </div>

    </animated.div>
    <ConfirmModal show={showConfirm} title="Close Board" description="Are you sure to remove this board?" onConfirm={handleConfirmClose} onCancel={handleCloseCancel} />
    </>
  );
}

