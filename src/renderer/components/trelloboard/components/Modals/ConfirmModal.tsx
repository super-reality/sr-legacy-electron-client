
import React from "react";

import {
  // useSelector,
  useDispatch
} from "react-redux";
import { animated, useSpring } from "react-spring";

// import reduxAction from "../../../../redux/reduxAction";
// import {
//   AppState
// } from "../../../../redux/stores/renderer";

import "./Modal.scss";

import CloseIcon from "../../../../../assets/images/trello/close.png"
import Card from "../../../../../assets/images/trello/card.png"

import { CloseModals } from "..";


export type ConfirmModalProps = {
  show:boolean,
  title: string,
  description: string,
  onConfirm: ()=>void,
  onCancel: ()=>void
}

export default function ConfirmModal({show, title, description, onConfirm, onCancel}: ConfirmModalProps) {

  const dispatch = useDispatch()


  const expandOpacity = useSpring({
    from: { opacity: show ? 0 : 1 },
    to: { opacity: show ? 1 : 0 },    
  } as any);

  const handleClick = () => {
    CloseModals(dispatch, "")
    if(onCancel){
      onCancel()
    }
  };


  const handleOverlayClick = (e : React.MouseEvent<Element, MouseEvent>)=>{
    e.stopPropagation()
    CloseModals(dispatch, "")
    if(onCancel){
      onCancel()
    }
    // reduxAction(dispatch, {
    //     type: "SET_SHOW_CONFIRM_MODAL",
    //     arg: false,
    // });
    
  }
  const onNo = ()=>{
    if(onCancel){
      onCancel()
    }
    CloseModals(dispatch, "")
    // reduxAction(dispatch, {
    //   type: "SET_SHOW_CONFIRM_MODAL",
    //   arg: false,
    // });
  }

  const onYes = ()=>{
    if(onConfirm){
      onConfirm()
    }
    CloseModals(dispatch, "")
    // reduxAction(dispatch, {
    //   type: "SET_SHOW_CONFIRM_MODAL",
    //   arg: false,
    // });
  }



  return (
    <animated.div 
        className={ show ? "modalRoot-overlay" : "modalRoot-overlay d-none"} 
        style={{ ...expandOpacity }}
        draggable={false}
        onDragStart={e=>e.stopPropagation()}
        onClick={e=>{handleOverlayClick(e)}}                  
    >
        
        <animated.div 
            className="datailModalContainer" 
            onClick={e=>{e.stopPropagation()}} 
            onMouseDown={e=>e.stopPropagation()}     
            style={{
                width: 300
            }}
        >
          
            
            <div className="modalHeader">
                
                <div className="modalTitle">
                    <img src={Card}/>    
                    <div >
                        <div >
                            {title}              
                        </div>
                        
                    </div>
                </div>
             
                <div className="modalClosebtn" onClick={() => { handleClick() }}>
                    <img src={CloseIcon} />
                </div>
            </div>
            <div className="modalBody">
                <div className="mainContent">
                    <div className="sectionTitle">
                        {description}
                    </div>
                    
                    <div style={{width:'100%',  height:40,display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                      <button 
                            type="button" 
                            className="btn btn-primary" 
                            style={{
                                width: 100,
                                marginTop: 10,  
                                                          
                            }}
                            onClick={onNo}
                            >
                               No                        
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            style={{
                                width: 100,
                                marginTop: 10,  
                                                          
                            }}
                            onClick={onYes}
                            >
                               Yes                        
                        </button>
                       
                    </div>
                    
                </div>
               
                
            
            </div>
           
        </animated.div>
        
    </animated.div>
  );
}

