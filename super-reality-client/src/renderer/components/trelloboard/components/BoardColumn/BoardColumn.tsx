import React, { KeyboardEvent, MouseEvent } from 'react';
// import { useDispatch } from 'react-redux';

import { useDispatch, useSelector } from 'react-redux';
import "./BoardColumn.scss";

import moreIcon from "../../../../../assets/images/trello/dots-horizontal.png";
import plusIcon from "../../../../../assets/images/trello/plus.png";
// import tempImage from "../../../../../assets/images/fx-in-popup-list-icon.png"

import {
  CardDataInterface, 
  BoardColumnProps, 
  RowCol,
  Position,
  BoardData,
  CloneBoard
} from"../types/types";

import reduxAction from "../../../../redux/reduxAction";

import {
  BoardColCard,
  CloseEdits,
  // BoardColModal,
  CloseModals
} from "../index";

import { 
	AppState
} from "../../../../redux/stores/renderer";


type PropsData = {
  col: number,
  data : BoardColumnProps
}


let dragItemColNode: EventTarget | null = null;


export default function BoardColumn( { data, col } : PropsData ) {

  const moreMenuRef =  React.useRef(null)

  const dispatch = useDispatch()

  const dragging = useSelector((state: AppState) => state.trello.dragging);
  const dragItem = useSelector((state: AppState) => state.trello.dragItem);
  const boardData = useSelector((state: AppState) => state.trello.boardData);

  const draggingCol = useSelector((state: AppState) => state.trello.draggingCol);
  const dragItemCol = useSelector((state: AppState) => state.trello.dragItemCol);
  // const columnTitles = useSelector((state: AppState) => state.trello.columnTitles);

  const editCol = useSelector((state: AppState)=>state.trello.editCol)
  const addCardCol = useSelector((state: AppState)=>state.trello.addCardCol)
  // const colMenuPosition = useSelector((state:AppState) => state.trello.colMenuPosition)

  const handleDragEnter = (e:  React.DragEvent<HTMLDivElement>, targetItem: RowCol) => {  
         

    if(dragItem == null || !boardData){
      return; 
    }
    
    if (dragItem.col !== targetItem.col || dragItem.row !== targetItem.row ) {
        
        // const newBoardData: Array<Array< CardDataInterface>> =  boardData.map(one=>{
        //   return one.map(item=>{
        //     return item
        //   })
        // })

        // const newBoardData:BoardData = {} as BoardData
        // Object.assign(newBoardData, boardData)
        const newBoardData = CloneBoard(boardData)
        

        if(dragItem){
          if(newBoardData.cols && newBoardData.cols[dragItem.col] && newBoardData.cols[dragItem.col].data){
            const colsData = newBoardData.cols[dragItem.col].data
            if(colsData){
              const moveItemArr = colsData.splice(dragItem.row, 1)

              if(moveItemArr.length > 0){
                colsData.splice(targetItem.row, 0, moveItemArr[0])
              }              
            }
            
          }
          
          // alert(JSON.stringify (moveItemArr))
          
          
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

  const handleDragEndCol = () => {

    reduxAction(dispatch, {
      type:'SET_DRAGITEM_COL',
      arg: null
    })

    if(dragItemColNode){
      dragItemColNode.removeEventListener('dragend', handleDragEndCol)
    }
     
    
    dragItemColNode = null;

    reduxAction(dispatch, {
      type: "SET_DRAGGING_COL",
      arg: false,
    });
}

  const handletDragStartCol = (e : React.DragEvent<HTMLDivElement>, colNumber: number) => {
    e.stopPropagation()
      
      reduxAction(dispatch, {
        type:'SET_DRAGITEM_COL',
        arg: colNumber
      })
      

      dragItemColNode = e.target

      dragItemColNode.addEventListener('dragend', handleDragEndCol)

      setTimeout(() => {

        reduxAction(dispatch, {
          type: "SET_DRAGGING_COL",
          arg: true,
        });
      }, 0)
  }

  const handleDragEnterCol = (e:  React.DragEvent<HTMLDivElement>, targetCol: number) => {
    e.stopPropagation()
      
    if(dragItemCol == null || !boardData){
      return;
    }
    
    if (dragItemCol !== targetCol ) {           

      const newBoardData:BoardData = CloneBoard(boardData)    

      if(dragItemCol >= 0){

        // const cols = [...newBoardData.cols]
        if(newBoardData.cols){
          const moveItemCol = newBoardData.cols.splice(dragItemCol, 1)
          if(moveItemCol.length > 0){
            newBoardData.cols.splice(targetCol, 0, moveItemCol[0])
          }              
  
          // const temp =  newColTitles[dragItemCol]
          // newColTitles[dragItemCol] =   newColTitles[targetCol]
          // newColTitles[targetCol] = temp

          reduxAction(dispatch, {
            type:'SET_DRAGITEM_COL',
            arg: targetCol
          })
          localStorage.setItem('boardData', JSON.stringify(newBoardData));
    
          reduxAction(dispatch, {
            type:'SET_BOARD_DATA',
            arg: newBoardData
          })
    
          // console.log('New column titles : ', newColTitles)
          // reduxAction(dispatch, {
          //   type: "SET_COLUMN_TITLES",
          //   arg: newColTitles
          // })

        }
        
        
        // console.log('moveItemCol: ', moveItemCol[0])
        
        
      }
      
      
    

    }
  }

  
  React.useEffect(()=>{
    
    if(addCardCol){
      const node = document.getElementById('newTitle') as HTMLInputElement
      node.focus()
    }

    if(editCol){      
      const node = document.getElementById('titleEditor') as HTMLInputElement
      node.focus()
    }
    
  }, [addCardCol, editCol])



  const handleMoreMenu = (e : MouseEvent) => {
    e.stopPropagation()
    const node = e.target as HTMLElement    
    const p = node.getBoundingClientRect()
    // console.log('open more menu : showBoardColModal > ', p.x) 
    const pos = {
      x: p.x,
      y: p.y,
      top: p.top,
      left: p.left,
      right: p.right,
      bottom : p.bottom,    
      width: p.width,
      height: p.height
    }  as Position

    CloseModals(dispatch, "")
    
    
    // console.log('Position of more menu: ',)
    reduxAction(dispatch, {
      type: "SET_COL_MENU_POSITION",
      arg: pos,
    });  

    reduxAction(dispatch, {
      type: "SET_CUR_BOARD_COL_ID",
      arg: data._id,
    });  

    setTimeout(() => {
      // console.log('called open new board col modal: ')
      reduxAction(dispatch, {
        type: "SET_SHOW_BOARD_COL_MODAL",
        arg: true,
      });  
    }, 100);    
  }

  const handleTitleClick = (e: MouseEvent)=>{
    CloseModals(dispatch, "")
    e.stopPropagation()
    reduxAction(dispatch, {
      type: "SET_EDIT_COL",
      arg: col
    })
    reduxAction(dispatch, {
      type: "SET_ADD_CARD_COL",
      arg: null
    })

  }

  const handleKeyPressTitle = (e : KeyboardEvent<HTMLInputElement>)=>{
    
    if(e.key == 'Enter'){
      const node = e.target as HTMLInputElement
      if(!node.value){
        
        return;
      }

      const newTitle = node.value;


      const newBoardData : BoardData = CloneBoard(boardData!)

      if(newBoardData.cols){
        newBoardData.cols[col].title = newTitle;
      }
      
      reduxAction(dispatch, {
        type:'SET_BOARD_DATA',
        arg: newBoardData
      })


      // const newColTitles = columnTitles.map((one: string, index: number)=>{
      //   if(index == editCol){
          
      //     return node.value
      //   }
      //   return one
      // })                               
      // reduxAction(dispatch, {
      //   type: "SET_COLUMN_TITLES",
      //   arg: newColTitles
      // })

      reduxAction(dispatch, {
        type: "SET_EDIT_COL",
        arg: null
      })
    }
  }

  const handleKeyPressNewTitle = (e : KeyboardEvent<HTMLInputElement>)=>{
    if(!boardData){
      return 
    }
    if(e.key == 'Enter'){
      const node = e.target as HTMLInputElement
      const newCardTitle = node.value
      const newCard : CardDataInterface = {
        key: (Math.round(Math.random()* 10000) + 1),
        title: newCardTitle,        
      }

      const newBoardData = CloneBoard(boardData)
      // Object.assign(newBoardData, boardData)
      // const newBoardData: Array<Array< CardDataInterface>> =  boardData.map(one=>{
      //   return one.map(item=>{
      //     return item
      //   })
      // })
      // const cols = newBoardData.cols
      if(newBoardData.cols){
        
        if(newBoardData.cols[col].data){
          (newBoardData.cols[col].data)!.push(newCard)
        }else{
          newBoardData.cols[col].data = [newCard]
        }
        reduxAction(dispatch, {
          type:'SET_BOARD_DATA',
          arg: newBoardData
        })
     
  
        reduxAction(dispatch, {
          type: "SET_ADD_CARD_COL",
          arg: null
        })
      }

      
    }
  }


  const handleAddCard = (e: MouseEvent<HTMLDivElement>)=>{
    e.stopPropagation()
    CloseEdits(dispatch, "SET_ADD_CARD_COL")
    // return
    // reduxAction(dispatch, {
    //   type:"SET_ADD_CARD_COL",
    //   arg: col
    // })
    // console.log('addCardCol:', addCardCol, ' newsetCol : ', col)
}

  const isCurrentCol = draggingCol && dragItemCol == col 

  return (
    <div 
      className="colRoot"
      onDragEnter={dragging && data && data.data && !(data.data.length) ? (e) => handleDragEnter(e, { col: col,row:0 }) : undefined} 
      onDrop={(e)=>{
        e.preventDefault()
      }}
      onDragOver={e=>{
          e.preventDefault()          
      }}
    > 

      <div 
        className={isCurrentCol === true ? "colContainer-current" : "colContainer"}    
        draggable
        onMouseDown={e=>{
          e.stopPropagation()
        }}  

        onDragStart={(e) => handletDragStartCol(e, col)} 
        onDragEnter={draggingCol ? (e) => { handleDragEnterCol(e, col) } : undefined} 
        onDrop={(e)=>{
          e.preventDefault()
  
        }}
        onDragOver={e=>{
          e.preventDefault()
          
        }}
      >
        <div className="colTitle" onClick={e=>handleTitleClick(e)}>
          {
            editCol == col ? (
              <div className="w-100 borderRadius-5">
                <input type="text" id="titleEditor" className="form-control bg-secondary" placeholder="Enter column title..." onKeyPress={e=>handleKeyPressTitle(e)}/>
              </div>
            ) : (
             
              // <span>{columnTitles[col]}</span>
              <span>{data.title}</span>
              
            ) 
          }
          
          <div ref={moreMenuRef} className="moreButton" onClick={e=>handleMoreMenu(e)}>
            <img src={moreIcon} width="20px"/>  
          </div>
          
        </div>
        <div className="colMainContainer">
          {
            data && data.data && data.data.map((one: CardDataInterface, row )=>{
              
              return(
                <BoardColCard 
                  row={row}                  
                  col={col}
                  key={one.key} 
                  data={one}
                  // title={one.title}
                  // img={one.img} 
                  // subtitle={one.subtitle}
                />
              ) 
            })
          }
          
        </div>
        
        <div 
          className="colFooter"
          // draggable
        
          onDragStart={(_) => {
            console.log('Drag Start on Col Footer now.')
            // e.stopPropagation()
          }} 

        >

          {
            addCardCol == col ? (
              <div 
                className="plusButton w-100" 
                onClick={_=>{
                  // e.stopPropagation()
                }}
              >
                {/* <textarea rows={5} className="bg-secondary addAnotherCardTitle" value={newTitle} onChange={e=>{setNewTitle((((e.target) as HTMLTextAreaElement).value) as any)}}> </textarea> */}
                <input 
                  type="text" 
                  id="newTitle" 
                  className="form-control bg-secondary"  
                  onKeyPress={e=>handleKeyPressNewTitle(e)} 
                  placeholder="Enter New Card Title..."
                  onClick={e=>{
                    e.stopPropagation()
                  }}                                    
                />
                
              </div>

            ):(
              <div className="plusButton" onClick={e=>handleAddCard(e)}>
                <img src={plusIcon} />            
                <span>Add another card</span>              
              </div>
            )
          }
          
                   
        </div>
      
      </div>
    
      
    </div>
  );
}


