import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import reduxAction from "../../../../redux/reduxAction";
import "./BoardContainer.scss";
import {
  BoardColumn,
  CloseModals,
  BoardColModal,
  CloseEdits,
  CardDetailModal
} from "../index";
// import tempImage from "../../../../../assets/images/fx-in-popup-list-icon.png"


// import { CardDataInterface } from '../types/types';
import { 
	AppState
} from "../../../../redux/stores/renderer";
import AddColumn from '../BoardColumn/AddColumn';
import { getAllBoardColumns } from '../../../../api/trello/apis';
// import reduxAction from '../../../../redux/reduxAction';


export default function BoardContainer() {
 
	
	const boardData = useSelector((state: AppState) => state.trello.boardData);
  const [isLoading, setIsLoading] = React.useState(false)
  
  const slider = React.useRef<HTMLDivElement>(null);
  let isDown = false;
  let startX : number;
  let scrollLeft: number;

  const dispatch = useDispatch()

  const loadingColumns = async()=>{
    if(isLoading){
      return
    }
    if(!boardData){
      return;
    }
    setIsLoading(true)
    await getAllBoardColumns(boardData._id)
    setIsLoading(false)

  }

  React.useEffect(()=>{
    loadingColumns()
  }, [])

  const handleClick = () => {
    CloseModals(dispatch, "")    
    
    CloseEdits(dispatch, null)
    
  };

  const handleMouseDown = (e: React.MouseEvent<Element, MouseEvent>) : void=>{
    
    isDown = true;
    if(slider.current){

      startX = e.pageX - slider.current.offsetLeft;
      scrollLeft = slider.current.scrollLeft;

    }
    
    
  }

  const handleMouseMove = (e: React.MouseEvent<Element, MouseEvent>) : void=>{
    if(!isDown) return;
    e.preventDefault();
    if(slider.current){
      const x = e.pageX - slider.current.offsetLeft;
      const walk = (x - startX ); // *3 
      slider.current.scrollLeft = scrollLeft - walk;
      
    }
    
  }

  const handleMouseLeave = (_: React.MouseEvent<Element, MouseEvent>) : void=>{
    
    isDown = false;
    // slider.classList.remove('active');
  }

  const handleMouseUp = (_: React.MouseEvent<Element, MouseEvent>) : void=>{
    
    isDown = false;
  }


  return (
    <div 
      ref={slider}
      id="boardCotainerId"
      className="boardCotainer"
      tabIndex={0}
      onClick={ handleClick }
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onDrop={(e)=>{
        e.preventDefault()
      }}
      onDragOver={e=>{
        e.preventDefault()          
      }}
      onScroll={_=>{CloseModals(dispatch, "")}}
    >
      
      { 
        boardData && boardData.cols && boardData.cols.map((one, oneI)=>{
          const  index = (oneI + 1) 
          
          return <BoardColumn col={oneI} data={one} key={index}/>
        })
      }
      <AddColumn />

      <BoardColModal/>
      <CardDetailModal/>
  
    </div>
  );
}

// HeaderBoard.propTypes = propTypes;
