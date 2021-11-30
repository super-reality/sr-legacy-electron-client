
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
import Card from "../../../../../assets/images/trello/card.png"
// import ListImg from "../../../../../assets/images/trello/list.png"
// import Actimg from "../../../../../assets/images/trello/actbars.png"

// import attachIcon from "../../../../../assets/images/trello/attach.png"


import AttachDetailModal from "./AttachDetailModal"
import { newBoard } from "../../../../api/trello/apis";

// import {
//     BoardColCardProps,
//     CardDataInterface,
//     Comment,
//     RowCol,
//     Attachment
// } from "../types/types"

export default function AddBoardModal() {

  const dispatch = useDispatch()

  const showAddBoardModal = useSelector((state: AppState) => state.trello.showAddBoardModal);
  const [isLoading, setIsLoading] = useState(false)
  // const [checkPublic, setCheckPublic] = useState(false)
//   const [title, setTitle] = React.useState('')
  

  const expandOpacity = useSpring({
    from: { opacity: showAddBoardModal ? 0 : 1 },
    to: { opacity: showAddBoardModal ? 1 : 0 },    
  } as any);

  const handleClick = () => {

    reduxAction(dispatch, {
      type: "SET_SHOW_ADD_BOARD_MODAL",
      arg: false,
    });

  };


  const handleOverlayClick = (e : React.MouseEvent<Element, MouseEvent>)=>{
    e.stopPropagation()
    reduxAction(dispatch, {
        type: "SET_SHOW_ADD_BOARD_MODAL",
        arg: false,
    });
    
  }

  const addBoard = async()=>{

    const node = document.getElementById('titleInput') as HTMLInputElement
    const check = document.getElementById('isPublicCheck') as HTMLInputElement 
    
    if(node && node.value && !isLoading){       
      setIsLoading(true)
      await newBoard(node.value, check.checked)
      setIsLoading(false)
    }
    node.value = ''
    reduxAction(dispatch, {
        type: "SET_SHOW_ADD_BOARD_MODAL",
        arg: false
    })
  }

  const onTitleKeyUp = (e : React.KeyboardEvent<HTMLInputElement>)=>{      
      if(e.key == 'Enter'){         
        addBoard()
      }
  }

  return (
    <animated.div 
        className={ showAddBoardModal ? "modalRoot-overlay" : "modalRoot-overlay d-none"} 
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
            <div>
              <div>
                Add new board title                            
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
                Enter title of new board
            </div>

            <div style={{display:'flex', flexDirection:'column', }}>      
              <input type="text" className="titleInput" id="titleInput" style={{width: '100%'}} onKeyUp={onTitleKeyUp}/>

              <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', alignItems:'center', marginTop: 10}} >
                <input type="checkbox" id="isPublicCheck" style={{width: 18, height: 18}}/>
                <label htmlFor="isPublicCheck" style={{flex:1, marginLeft: 5}}>Public</label>
              </div>
            </div>
            <div style={{width:'100%',  height:40, textAlign:'right'}}>
                <button
                  type="button"
                  className="btn btn-primary" 
                  style={{
                      width: 100,
                      marginTop: 10,
                  }}
                  onClick={addBoard}
                >
                  {
                    isLoading ? 'Creating...' : 'Create'
                  }                            
                </button>
            </div>              
          </div>        
        </div>
          
      </animated.div>
      <AttachDetailModal/>
    </animated.div>
  );
}

