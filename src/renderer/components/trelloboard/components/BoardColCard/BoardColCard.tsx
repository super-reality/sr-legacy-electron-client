import React from 'react';
import "./BoardColCard.scss";

import { useDispatch, useSelector } from 'react-redux';
import reduxAction from "../../../../redux/reduxAction";

import attachIcon from "../../../../../assets/images/trello/attach.png"
import chatIcon from "../../../../../assets/images/trello/chat.png"
import { 
  BoardColCardProps,
  RowCol,
  CloneBoard
} from"../types/types";
import { 
	AppState
} from "../../../../redux/stores/renderer";
import { getAllCommentsByCardId } from '../../../../api/trello/apis';


let dragItemNode: EventTarget | null = null;

export default function BoardColCard({ row, col,  data} : BoardColCardProps) {

    const dispatch = useDispatch()
    const dragging = useSelector((state: AppState) => state.trello.dragging);
    const boardData = useSelector((state: AppState) => state.trello.boardData);
    const dragItem = useSelector((state: AppState) => state.trello.dragItem);

    const handleDragEnd = () => {

      reduxAction(dispatch, {
        type:'SET_DRAGITEM',
        arg: null
      })

      if(dragItemNode){
        dragItemNode.removeEventListener('dragend', handleDragEnd)
      }
       
      dragItemNode = null;

      reduxAction(dispatch, {
        type: "SET_DRAGGING",
        arg: false,
      });
  }

    const handletDragStart = (e : React.DragEvent<HTMLDivElement>, item: RowCol) => {
      e.stopPropagation()
        e.currentTarget.classList.add('rotate')
    
        reduxAction(dispatch, {
          type:'SET_DRAGITEM',
          arg: item
        })
        

        dragItemNode = e.target

        dragItemNode.addEventListener('dragend', handleDragEnd)

        setTimeout(() => {

          reduxAction(dispatch, {
            type: "SET_DRAGGING",
            arg: true,
          });
        }, 0)
    }
    const handleDragEnter = (e:  React.DragEvent<HTMLDivElement>, targetItem: RowCol) => {
        
      e.stopPropagation()
        if(dragItem == null || !boardData){
          return;
        }
        
        if (dragItem.col !== targetItem.col || dragItem.row !== targetItem.row ) {
            
            const newBoardData = CloneBoard(boardData)

            
            if(dragItem && newBoardData.cols && newBoardData.cols[dragItem.col].data){

              
              if(newBoardData.cols[dragItem.col].data){
                const colCardList = [...(newBoardData.cols[dragItem.col].data)!]
                const moveItemArr = colCardList.splice(dragItem.row, 1)

                newBoardData.cols[dragItem.col].data  = [...colCardList]


                if(moveItemArr.length > 0){
                  
                  (newBoardData.cols[targetItem.col].data)!.splice(targetItem.row, 0, moveItemArr[0])
         
                }              
              }
              
              
            }
                        
            reduxAction(dispatch, {
              type:'SET_DRAGITEM',
              arg: targetItem
            })
            localStorage.setItem('boardData', JSON.stringify(newBoardData));

            reduxAction(dispatch, {
              type:'SET_BOARD_DATA',
              arg: newBoardData
            })

        }
    }

  const handleClickCard = (_: any)=>{
    
    reduxAction(dispatch, {
      type:"SET_DETAIL_CARD_DATA",
      arg: data
    })
    reduxAction(dispatch, {
      type: "SET_SHOW_CARD_DETAIL_MODAL",
      arg: true,
    });
    reduxAction(dispatch, {
      type: "SET_DETAIL_CARD_POSITION",
      arg: {row , col},
    });

    setTimeout(async() => {
      await getAllCommentsByCardId(data._id)
    }, 100);


    
  }

    
  const isCurrentCard = dragging && dragItem && dragItem.row == row && dragItem.col == col

  return (
    <div 
      className={ isCurrentCard ? 'cardContainer-current' : "cardContainer"}
      tabIndex={0}    
      onClick={e=>handleClickCard(e)}
      onMouseDown={e=>{
        e.stopPropagation()
      }}
      draggable
      onDragStart={(e) => handletDragStart(e, { col, row })} 
      onDragEnter={dragging ? (e) => { handleDragEnter(e, { col, row }) } : undefined}      
      onDrop={(e)=>{
          e.preventDefault()
      }}
      onDragOver={e=>{
          e.preventDefault()
          e.dataTransfer.dropEffect = "move"
      }}
    >
      <div className="cardTitle">
        <span>{data.title}</span>
      </div>
      {
        data.coverImage  && (
          <div className="imgContainer" >
            <img src={data.coverImage} draggable={false}/>
          </div>
        )
      }
      {
        !(data.coverImage) && data.attaches && data.attaches.length && (
          <div className="imgContainer">
            <img src={data.attaches[0].link} draggable={false}/>
          </div>
        )
      }
          
      {
        data.subtitle && (
          <div className="cardTitle">
            <span>{data.subtitle}</span>                
          </div>
        )
      }
      
      <div className="cardFooter">
        <img src={attachIcon} />
        <span>{data.attaches?.length}</span>
        <img src={chatIcon} />
        <span>{data.comments?.length}</span>
      </div>


    </div>
  );
}


