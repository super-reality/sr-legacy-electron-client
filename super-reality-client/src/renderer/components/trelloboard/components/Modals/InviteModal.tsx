import React, { useState } from "react";

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

import TeamImg from "../../../../../assets/images/trello/team.png"
import BackImg from "../../../../../assets/images/trello/back.png"

export default function InviteModal() {

  const dispatch = useDispatch()

  const showInviteModal = useSelector((state: AppState) => state.trello.showInviteModal);

  const [isEnterMode, setIsEnterMode] = useState(false)

  React.useEffect(()=>{
    if(!showInviteModal){
      setIsEnterMode(false)
    }
  }, [showInviteModal])
  const expand = useSpring({
    from: { 
      left: showInviteModal ? "150px" : "230px", 
      opacity: showInviteModal ? 0 : 1 
    },
    to: { 
      left: showInviteModal ? "230px" : "150px", 
      opacity: showInviteModal ? 1 : 0 
    },
    onStart:()=>{
      const obj = document.getElementById('modalContainerinvite')
      if(obj != null){
        if(showInviteModal){              
          obj.classList.remove('d-none')
        }else{
          obj.classList.add('d-none')
        }
      }       
    },
    onRest:()=>{
      
      const obj = document.getElementById('modalContainerinvite')
      if(obj != null){
        if(!showInviteModal){    
          obj.classList.add('d-none')        
        }
      }             
    }
  } as any);

  const handleClick = () => {
    // setisOpen(false)
    
    reduxAction(dispatch, {
      type: "SET_SHOW_INVITE_MODAL",
      arg: false,
    });
    setIsEnterMode(false)
  };

  const handleAddTeam = ()=>{
    console.log('asdc')
    setIsEnterMode(true) 
  }

  const onAdd = ()=>{
    
    reduxAction(dispatch, {
      type: "SET_SHOW_INVITE_MODAL",
      arg: false,
    });
    setIsEnterMode(false) 
  }

  const handleBack = ()=>{
    setIsEnterMode(false) 
  }


 

  return (
    <animated.div className="modalContainerinvite" id="modalContainerinvite" style={{ ...expand }}>
      <div className="modalHeader">
        {
          isEnterMode && (
            <div className="modalBackbtn" onClick={() => { handleBack() }}>
              <img src={BackImg} />
            </div>
          )
        }
        
        <div className="modalTitle">
          Add to team
        </div>
        <div className="modalClosebtn" onClick={() => { handleClick() }}>
          <img src={CloseIcon} />
        </div>
      </div>
      {
        isEnterMode ? (
          <div className="modalBody">
             <div style={{textAlign:'left'}}>
              <h4>Your teams</h4>
            </div>
            <div>
              <select name="selTeam" className="selTeam">
                <option>Team1</option>
                <option>Team2</option>
                <option>Team3</option>
              </select>
            </div>
            <div className="buttonItem bg-secondary" onClick={()=>onAdd()}>
              <div className="itemTitleRowCenter">            
                <div>Add to team</div>
              </div>          
            </div>
          </div>
        ):(
          <div className="modalBody">
          
            <div style={{marginBottom: '50px'}}>
              <img src={TeamImg} width="250px" draggable="false"/>
              
              <div style={{textAlign:'center'}}>
                <h4>It&apos;s time for a team.</h4>
              </div>
              <p style={{fontSize: '0.95rem'}}>
                Teams make coolaboration easier. To invite people to this board, add it to a team.
              </p>
            </div>
                 
  
            <div className="buttonItem  bg-secondary" onClick={()=>handleAddTeam()}>
              <div className="itemTitleRowCenter">            
                <div>Add to team</div>
              </div>          
            </div>
          {/* <div className="buttonItem" onClick={()=>handleClickItem()}>
            <div className="itemTitleRow">
              
              <div>Allow Notification</div>
            </div>          
          </div> */}
  
        
        </div>
  
        )
      }
     
    </animated.div>
  );
}

