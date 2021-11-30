import React, { useEffect } from 'react';
import { 
  useDispatch, 
  useSelector 
} from 'react-redux';
// import reduxAction from "../../../../redux/reduxAction";
import "./HomeBoard.scss";
// import {
//   BoardColumn,
//   CloseModals,
//   BoardColModal,
//   CloseEdits,
//   CardDetailModal
// } from "../index";
import trelloLogo from "../../../../../assets/images/trello/trello-logo.png"


import { 
	AppState
} from "../../../../redux/stores/renderer";



import reduxAction from '../../../../redux/reduxAction';
import { BoardData } from '../types/types';
import { getAllBoard, getAllCardsById, getAllPublicBoards } from '../../../../api/trello/apis';



export default function HomeBoard() {
 
	const dispatch = useDispatch()
	const boardData = useSelector((state: AppState) => state.trello.boardData);
  // const token = useSelector((state: AppState)=>state.auth.token)

  const recentBoards = useSelector((state: AppState) => state.trello.recentBoards);
  const personalBoards = useSelector((state: AppState) => state.trello.personalBoards);
  const publicBoards = useSelector((state: AppState) => state.trello.publicBoards);


  useEffect(()=>{
    
    (async()=>{
      getAllBoard()
      getAllPublicBoards()
    })()

  }, [])

  if(boardData){
    return null
  }
  
  const onClickCard = (board : BoardData)=>{
    reduxAction(dispatch, {
      type: "SET_BOARD_DATA",
      arg: board
    })

    setTimeout(async() => {
      await getAllCardsById(board._id)
    }, 100);

  }


  return (   
        
      <div className="homeContainer">
        {/* <div className="leftSide">
          <div className="itemRow sel">
              <img src={trelloLogo} />
              Boards
          </div>
          <div className="itemRow">
            <img src={trelloLogo} />
              Home
          </div>          
        </div> */}
        <div className="rightSide">
          {/* <div className="itemRow">
            <img src={trelloLogo} />
              Recently Viewed
          </div> */}
          <div className="boardCardContainer">
          {
              recentBoards && recentBoards.map(one=>{
                return (
                  <div className="boardCard" key={Math.random().toString()} onClick={()=>onClickCard(one)}>
                    {one.title}
                  </div>
                )                
              })
            }
          </div>
          <div className="itemRow">
            <img src={trelloLogo} />
              Personal boards
          </div>
          <div className="boardCardContainer">
            {
              personalBoards && personalBoards.map(one=>{
                return (
                  <div className="boardCard" key={Math.random().toString()}  onClick={()=>onClickCard(one)}>
                    {one.title}
                  </div>
                )
              })
            }
          </div>

          <div className="itemRow">
            <img src={trelloLogo} />
              Public board
          </div>
          <div className="boardCardContainer">
            {/* <div className="boardCard" key={Math.random().toString()} >
              Shared
            </div> */}
            {
              publicBoards && publicBoards.map(one=>{
                return (
                  <div className="boardCard" key={`public_${Math.random().toString()}`}  onClick={()=>onClickCard(one)}>
                    {one.title}
                  </div>
                )
              })
            }

            {/* {
              personalBoards && personalBoards.map(one=>{
                return (
                  <div className="boardCard" key={Math.random().toString()}  onClick={()=>onClickCard(one)}>
                    {one.title}
                  </div>
                )                
              })
            } */}
            
          </div>
          
        </div>

        
      </div>
      
  );
}

// HeaderBoard.propTypes = propTypes;
