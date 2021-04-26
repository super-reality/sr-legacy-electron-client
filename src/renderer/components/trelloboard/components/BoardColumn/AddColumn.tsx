import React, { KeyboardEvent, MouseEvent, useState } from 'react';
// import { useDispatch } from 'react-redux';

import { 
    // useDispatch, 
    useSelector 
} from 'react-redux';
import "./BoardColumn.scss";

// import moreIcon from "../../../../../assets/images/trello/dots-horizontal.png";
// import plusIcon from "../../../../../assets/images/trello/plus.png";
// import tempImage from "../../../../../assets/images/fx-in-popup-list-icon.png"

// import {
//   CardDataInterface, 
//   BoardColumnProps, 
//   RowCol,
//   Position,
//   BoardData,
//   CloneBoard
// } from"../types/types";

// import reduxAction from "../../../../redux/reduxAction";

// import {
//   BoardColCard,
//   CloseEdits,
//   // BoardColModal,
//   CloseModals
// } from "../index";

import { 
	AppState
} from "../../../../redux/stores/renderer";
import { newBoardCol } from '../../../../api/trello/apis';


// type PropsData = {
//   col: number,
//   data : BoardColumnProps
// }



export interface LoaderViewProps {
  isLoading : boolean
}

const  LoaderView = ({isLoading} : LoaderViewProps)=>{

  if(isLoading){
    return <span>Creating new column ...</span>                
  }
   
  return <span>Add new column</span>
}

export default function AddColumn() {

    // const moreMenuRef =  React.useRef(null)
  
    // const dispatch = useDispatch()
    const [isEdit, setIsEdit] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const boardData = useSelector((state: AppState) => state.trello.boardData);
  
  
    const handleTitleClick = (e: MouseEvent)=>{
        e.stopPropagation()
      setIsEdit(true)
   
    }

    const onBlur=()=>{
        
        setIsEdit(false)
    }
    const onCancel = (e : MouseEvent)=>{
        console.log('click cancel:')
        e.stopPropagation()
        setIsEdit(false)
    }
  
    const handleKeyPressTitle = async (e : KeyboardEvent<HTMLInputElement>)=>{
        if(isLoading){
            return 
        }
        if(e.key == 'Enter'){
            const node = e.target as HTMLInputElement
            if(!node.value){
                setIsEdit(false)
                return;
            }
    
            const newTitle = node.value;
            const col = boardData && boardData.cols ? boardData.cols.length : 0;
            const boardId = boardData && boardData._id ? boardData._id : '';

            setIsLoading(true)
            await newBoardCol(boardId, col, newTitle)
            setIsLoading(false)
            

            setIsEdit(false)
    
    
        }
    }
  
  
    return (
      <div className="colRoot"> 
  
        <div className="colContainer">
          <div className="colTitle" onClick={e=>handleTitleClick(e)}>

            {
              isEdit && !isLoading ? (
                <div className="w-100 borderRadius-5 colTitleInputContainer">
                  <input type="text" id="titleEditor" className="form-control bg-secondary inputText" placeholder="Enter column title..." onKeyPress={e=>handleKeyPressTitle(e)} onBlur={()=>onBlur()}/>
                  <div  className="closeBtn" onClick={(e)=>onCancel(e)}>X</div>
                </div>
              ) : (<LoaderView isLoading={isLoading}/>)
            }
            
          </div>
         
        
        </div>
      
        
      </div>
    );
  }
  
