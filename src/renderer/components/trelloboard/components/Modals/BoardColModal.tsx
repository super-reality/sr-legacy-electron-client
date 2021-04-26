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
import { removeBoardCol } from "../../../../api/trello/apis";


const mainItems =[
  {
    title: 'Add Card...',    
  },
  {
    title: 'Copy List...',    
  },
  {
    title: 'Move List...',    
  },
  {
    title: 'Watch',    
  },
]
const sortItems =[
  {
    title: 'Sort By...',    
  },  
]
const feedbacks = [
  {
    title: 'When a card is added to the list...',    
  },
  {
    title: 'Every day sort list by...',    
  },
  {
    title: 'Every Monday sort list by...',    
  },
]
const moves = [
  {
    title: 'Move All Cards in This List...',    
  },
  {
    title: 'Archive All Cards in This List...',    
  }  
]

const archives = [
  // {
  //   title: 'Archive This List'
  // },
  {
    title: 'Remove This List'
  }
]

export default function BoardColModal() {

  const dispatch = useDispatch()

  const showBoardColModal = useSelector((state: AppState) => state.trello.showBoardColModal);
  const colMenuPosition = useSelector((state: AppState) => state.trello.colMenuPosition)
  const curBoardColId = useSelector((state: AppState) => state.trello.curBoardColId)
  
  const el = document.getElementById("boardCotainerId")
  const scrollLeft = el?.scrollLeft as number
  const containerWidth = el?.getBoundingClientRect().width as number
  
  let left = 100;

  if(colMenuPosition){
    left = colMenuPosition.x + scrollLeft 
    if(left + 300 > containerWidth + scrollLeft){
      left -= 300
    }   
  }

  // console.log('showBoardColModal : ', showBoardColModal)

  const expand = useSpring({
    from: {       
      opacity:  showBoardColModal ? 0 : 1
    },
    to: {       
      opacity:  showBoardColModal ? 1 : 0
    }  
  } as any);

  const handleClick = () => {
    
    reduxAction(dispatch, {
      type: "SET_SHOW_BOARD_COL_MODAL",
      arg: false,
    });

  };

  const handleClickItem = async (one : string|undefined|null)=>{
    reduxAction(dispatch, {
      type: "SET_SHOW_BOARD_COL_MODAL",
      arg: false,
    });

    if(one == 'Remove This List'){
      reduxAction(dispatch, {
        type: "SET_SHOW_BOARD_COL_MODAL",
        arg: false,
      });

      if(curBoardColId){
        
        await removeBoardCol(curBoardColId)

      }

      
    }

  }
 

  return (
    <animated.div  id="boardColModal" className={showBoardColModal ? "modalContainerAcc" : "modalContainerAcc d-none"} style={{left: left,  ...expand }}>
      <div className="modalHeader">
        <div className="modalTitle">
          List Actions
        </div>
        <div className="modalClosebtn" onClick={() => { handleClick() }}>
          <img src={CloseIcon} />
        </div>
      </div>
      <div className="modalBody">
               
        {/* <div className="divider"/> */}
        {/* {
          mainItems.map((one, key)=>{
            const index = key +1;
            return (
              <div key={index} className="buttonItem" onClick={()=>handleClickItem(one.title)}>
                <div className="itemTitleRow">            
                  <div>{one.title}</div>
                </div>          
              </div>
            )
          })          
        } */}
       {/* <div className="divider"/> */}
        {/* {
          sortItems.map((one, key)=>{
            const index = key +1;
            return (              
              <div key={index} className="buttonItem" onClick={()=>handleClickItem(one.title)}>
                <div className="itemTitleRow">            
                  <div>{one.title}</div>
                </div>          
              </div>
            )
          })          
        } */}
        {/* <div className="divider"/> */}
        {/* {
          feedbacks.map((one, key)=>{
            const index = key +1;
            return (              
              <div key={index} className="buttonItem" onClick={()=>handleClickItem(one.title)}>
                <div className="itemTitleRow">            
                  <div>{one.title}</div>
                </div>          
              </div>
            )
          })          
        }
         */}
        {/* <div className="buttonItem" onClick={()=>handleClickItem('')}>
          <div className="itemTitleRow">            
            <div>Create a custom Butler rule</div>
          </div>          
        </div> */}
        {/* <div className="divider"/>
        {
          moves.map((one, key)=>{
            const index = key +1;
            return (              
              <div key={index} className="buttonItem" onClick={()=>handleClickItem(one.title)}>
                <div className="itemTitleRow">            
                  <div>{one.title}</div>
                </div>          
              </div>
            )
          })          
        } */}
        {/* <div className="divider"/> */}
        {
          archives.map((one, key)=>{
            const index = key +1;
            return (              
              <div key={index} className="buttonItem" onClick={()=>handleClickItem(one.title)}>
                <div className="itemTitleRow">            
                  <div>{one.title}</div>
                </div>          
              </div>
            )
          })          
        }
              
      </div>

    </animated.div>
  );
}

