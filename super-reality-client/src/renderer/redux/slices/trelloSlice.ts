/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import Axios from "axios";
import { 
  CardDataInterface,
  RowCol,
  Position,
  BoardColCardProps,
  Attachment,
  BoardData,
  BoardColumnProps,
  BoardColPayloadType
} from '../../components/trelloboard/components/types/types';

import tempImage from "../../../assets/images/fx-in-popup-list-icon.png"
import fxImg from "../../../assets/images/fx-popup-icon.png"


const temp : Array<CardDataInterface> = [
  {
    key:1,
    title:'1. Title of card dagc iasd cahsbd ck abhsd ckjabh sd casd oasd cas d',
    img:tempImage,
    subtitle:'aksdnclaksjd'
  },
  {
    key:2,
    title:'Title of card2',
    // img:tempImage,
    // subtitle:'aksdnclaksjd'
  },
  {
    key:3,
    title:'Title of card3',
    // img:tempImage,
    // subtitle:'aksdnclaksjd'
  },
  {
    key:1,
    title:'Title of card4',
    img:fxImg,
    subtitle:'aksdnclaksjd'
  },
  {
    key:1,
    title:'Title of card5',
    img:tempImage,
    // subtitle:'aksdnclaksjd'
  },
  {
    key:1,
    title:'Title of card 6',
    img:fxImg,
    subtitle:'aksdnclaksjd'
  },
  {
    key:1,
    title:'Title of card 7',
    img:tempImage,
    subtitle:'aksdnclaksjd'
  },
  {
    key:1,
    title:'Title of card 8',
    img:fxImg,
    // subtitle:'aksdnclaksjd'
  },
  {
    key:1,
    title:'Title of card 9',
    img:tempImage,
    subtitle:'aksdnclaksjd'
  },
  {
    key:1,
    title:'Title of card 10',
    img:fxImg,
    subtitle:'aksdnclaksjd'
  },
  {
    key:1,
    title:'Title of card 11',
    img:tempImage,
    // subtitle:'aksdnclaksjd'
  },
  {
    key:1,
    title:'Title of card 12',
    img:fxImg,
    subtitle:'aksdnclaksjd'
  },
]


let indexer = 1
const InitColumnTitles : string[] = ['Col1', 'Col2', 'Col3', 'Col4', 'Col5', 'Col6', 'Col7', 'Col8', 'Col9']

export const MakeTempBoardData = (titleSuffix : string)=>{
  return {
    _id: 'asdcasdc',
    title: `B - ${titleSuffix}`,
    ownerId: '1',
    createdAt: `${new Date().toLocaleDateString()} ${new Date().toLocaleString()}`,
    updatedAt: `${new Date().toLocaleDateString()} ${new Date().toLocaleString()}`,
    cols: 
    [1, 2, 3, 4, 5, 6, 7, 8, 9].map(one =>{
    
      const begin = Math.round(Math.random() * 1 )+ 0
      const end = Math.round(Math.random() * 2 )+ 2
      const arr = temp.slice( begin , end)
        
      const cardArr : CardDataInterface[] = arr.map((item)=>{
        
        const data = {...item}
        data.title = `title ${indexer}`
        // data.img = undefined
        data.key = indexer
        indexer += 1 
        return data
      })
    
      const col : BoardColumnProps = {
        _id:'asdcasd',
        boardId:'asdcasdcdcdcc',
        archived: false,
        createdAt:'202020200',
        col: one,
        title: `Col_${titleSuffix}_${one}`,
        data: cardArr
      }   
    
      return col
    
    })
    
  }
}
export const initBoardData : BoardData =  MakeTempBoardData('init')

export const SeedRecentBoards : BoardData[] =  [1,2,3,4,5,6,7].map(one=>{
    return MakeTempBoardData(`RecentBoard-${one}`)
  })


export const SeedPersonalBoard : BoardData[] =  [1,2,3,4,5,6,7,2,3,4,5,6,7,2,3,4,5,6,7,2,3,4,5,6,7].map(one=>{
    return MakeTempBoardData(`PersonalBoard-${one}`)
  })


export type TrelloState = {
  isShowBoardMenu: boolean, // true disables auth !  
  // boardData: CardDataInterface[][] | null | undefined,
  recentBoards : BoardData[] | null,
  personalBoards : BoardData[] | null,
  boardData: BoardData | null | undefined,
  dragging: boolean,
  dragItem: RowCol | null,
  draggingCol: boolean,
  dragItemCol: number | null,
  showCreateModal: boolean,
  showNotiModal: boolean,
  showInfoModal: boolean,
  showAccModal: boolean,
  showInviteModal: boolean,
  showSubAccModal: boolean,
  showBoardColModal: boolean,
  colMenuPosition: Position | null,
  columnTitles: string[],
  editCol: number | null,
  addCardCol: number | null,

  showCardDetailModal: boolean,
  detailCardData: CardDataInterface | null,
  detailCardPosition: RowCol | null,
  showAttachDetailModal : boolean
  attachDetailData: Attachment | null,
  showAddBoardModal: boolean,
  showSubHeaderMoreMenu: boolean,
  showConfirmModal: boolean,

  curBoardColId: string|undefined|null
}

const initialState : TrelloState= {
  isShowBoardMenu: false, // true disables auth !  
  boardData:null,
  dragging: false,
  dragItem: null,
  draggingCol: false,
  dragItemCol: null,
  showCreateModal:false,
  showNotiModal: false,
  showInfoModal: false,
  showAccModal: false,
  showInviteModal: false,
  showSubAccModal: false,
  showBoardColModal: false,
  colMenuPosition: null,
  columnTitles: InitColumnTitles,
  editCol: null,
  addCardCol: null,
  showCardDetailModal: false,
  detailCardData: null,
  detailCardPosition: null,
  showAttachDetailModal: false,
  attachDetailData: null,
  recentBoards: [],
  personalBoards: [],
  showAddBoardModal: false,
  showSubHeaderMoreMenu: false,
  showConfirmModal: false,
  curBoardColId: null
};


const trelloSlice = createSlice({
  name: "trello",
  initialState,
  reducers: {
    setShowBoardMenu: (state: TrelloState, action: PayloadAction<boolean>): void => {
      state.isShowBoardMenu = action.payload;
    },
    setBoardData:(state: TrelloState , action: PayloadAction<typeof initBoardData | null | undefined>):void=>{
      state.boardData = action.payload
    },

    setDragging:(state: TrelloState, action: PayloadAction<boolean>): void=>{
      state.dragging = action.payload
    },
    setDragItem:(state: TrelloState, action: PayloadAction<RowCol | null>): void=>{
      state.dragItem = action.payload
    },
    setDraggingCol:(state: TrelloState, action: PayloadAction<boolean>): void=>{
      state.draggingCol = action.payload
    },
    setDragItemCol:(state: TrelloState, action: PayloadAction<number | null>): void=>{
      state.dragItemCol = action.payload
    },
    setShowCreateModal:(state: TrelloState, action: PayloadAction<boolean>): void=>{
      state.showCreateModal = action.payload
    },
    setShowNotiModal:(state: TrelloState, action: PayloadAction<boolean>): void=>{
      state.showNotiModal = action.payload
    },
    setShowInfoModal:(state: TrelloState, action: PayloadAction<boolean>): void=>{
      state.showInfoModal = action.payload
    },
    setShowAccModal:(state: TrelloState, action: PayloadAction<boolean>): void=>{
      state.showAccModal = action.payload
    },
    setShowInviteModal:(state: TrelloState, action: PayloadAction<boolean>): void=>{
      state.showInviteModal = action.payload
    },
    setShowSubAccModal:(state: TrelloState, action: PayloadAction<boolean>): void=>{
      state.showSubAccModal = action.payload
    },
    setShowBoardColModal:(state: TrelloState, action: PayloadAction<boolean>): void=>{
      state.showBoardColModal = action.payload
    },

    setColMenuPosition:(state: TrelloState, action: PayloadAction<Position>): void=>{
      state.colMenuPosition = action.payload
    },

    setColumnTitles:(state: TrelloState, action: PayloadAction<string[]>): void=>{
      state.columnTitles = action.payload
    },
    setEditCol:(state: TrelloState, action: PayloadAction<number|null>): void=>{
      state.editCol = action.payload
    },
    setAddCardCol: (state: TrelloState, action: PayloadAction<number|null>): void=>{
      state.addCardCol = action.payload
    },
    setShowCardDetailModal: (state: TrelloState, action: PayloadAction<boolean>): void=>{
      state.showCardDetailModal = action.payload
    },

    setDetailCardData: (state: TrelloState, action: PayloadAction<CardDataInterface|null>): void=>{
      state.detailCardData = action.payload
    },

    setDetailCardPosition: (state: TrelloState, action: PayloadAction<RowCol|null>): void=>{
      state.detailCardPosition = action.payload
    },

    updateCard: (state: TrelloState, action: PayloadAction<BoardColCardProps>): void=>{

      if(state.boardData && action.payload){
        // const tempData =  state.boardData.cols.map(col=>col.map(card=>card))
        // tempData[action.payload.col][action.payload.row]  = action.payload.data
        // state.boardData = tempData.map(col=>col.map(one=>one))  
        const tempData =  {} as BoardData
        Object.assign(tempData, state.boardData)

        if(tempData.cols && tempData.cols.length && tempData.cols[action.payload.col].data){
          const col : Array<CardDataInterface> | undefined = tempData.cols[action.payload.col].data
          
          if(col && col.length){
            col[action.payload.row] = action.payload.data
          }          

          state.boardData = {...tempData}
        }
        
        
      }     

    },
    setShowAttachDetailModal: (state: TrelloState, action: PayloadAction<boolean>): void=>{
      state.showAttachDetailModal = action.payload
    },
    
    setAttachDetailData: (state: TrelloState, action: PayloadAction<Attachment|null>): void=>{
      state.attachDetailData = action.payload
    },

    setShowAddBoardModal: (state : TrelloState, action: PayloadAction<boolean>):void=>{
      state.showAddBoardModal = action.payload
    },

    addPersonalBoard :  (state : TrelloState, action: PayloadAction<BoardData>):void=>{
      
      if(state.personalBoards){
        state.personalBoards.push(action.payload)
      }else{
        state.personalBoards = [action.payload]
      }
    },
    addRecentBoard :  (state : TrelloState, action: PayloadAction<BoardData>):void=>{
      if(state.recentBoards){
        state.recentBoards.push(action.payload)
      }else{
        state.recentBoards = [action.payload]
      }      
    },
    setPersonalBoard :  (state : TrelloState, action: PayloadAction<BoardData[]>):void=>{
      
        state.personalBoards = action.payload
      
    },
    deletePeronalBoard: (state : TrelloState, action: PayloadAction<string>):void=>{
      if(state.personalBoards){
        state.personalBoards = state.personalBoards.filter(one=>one._id != action.payload)
      }
      
    
    },
    setRecentBoard :  (state : TrelloState, action: PayloadAction<BoardData[]>):void=>{
      
      state.recentBoards = action.payload
    
    },
    setShowSubHeaderMoreMenu:(state: TrelloState, action: PayloadAction<boolean>): void=>{
      state.showSubHeaderMoreMenu = action.payload
    },
    setShowConfirmModal:(state: TrelloState, action: PayloadAction<boolean>): void=>{
      state.showConfirmModal = action.payload
    },

    addColumnToBoard: (state : TrelloState, action: PayloadAction<BoardColumnProps>) : void=>{
      if(state.personalBoards){
        state.personalBoards.forEach(one=>{
          if(one._id == action.payload.boardId){
            console.log('personal boardData cols added : ', action.payload)
            if(one.cols){
              one.cols.push(action.payload)
            }else{
              one.cols = [action.payload]
            }

          }
        })
      }
      // todo add current boardData

      if(state.boardData){
        console.log('boardData cols added : ', action.payload)
        if(state.boardData.cols){
          state.boardData.cols.push(action.payload)        
        }else{
          state.boardData.cols = [action.payload]
        }        
      }

      
    },

    setBoardCols:  (state : TrelloState, action: PayloadAction<BoardColPayloadType>) : void=>{
      if(state.personalBoards){
        state.personalBoards.forEach(one=>{
          if(one._id == action.payload.boardId){
            console.log('personal boardData cols added : ', action.payload.cols)
            one.cols = action.payload.cols
            
          }
        })
      }
      // todo add current boardData

      if(state.boardData){
        console.log('boardData cols added : ', action.payload)
        if(state.boardData._id == action.payload.boardId){
          state.boardData.cols = action.payload.cols
        }     
      }

      
    },

    setCurBoardColId:  (state : TrelloState, action: PayloadAction<string>) : void=>{
      state.curBoardColId = action.payload      
    },

    removeBoardCol: (state : TrelloState, action: PayloadAction<string>) : void=>{
      if(state.boardData){
        const boardId = state.boardData._id
        state.boardData.cols = state.boardData.cols?.filter(one=>one._id != action.payload)

        if(state.personalBoards){
          state.personalBoards.forEach(one=>{
            if(one._id == boardId){
              one.cols = one.cols?.filter(a=>a._id!= action.payload)
            }
          })
        }
        
      }

      
    },
    
  },
});

export const {
  setShowBoardMenu, 
  setBoardData,
  setDragging,
  setDragItem,
  setDraggingCol,
  setDragItemCol,
  setShowCreateModal,
  setShowNotiModal,
  setShowInfoModal,
  setShowAccModal,
  setShowInviteModal,
  setShowSubAccModal,
  setShowBoardColModal,
  setColMenuPosition,
  setColumnTitles,
  setEditCol,
  setAddCardCol,
  setShowCardDetailModal,
  setDetailCardData,
  setDetailCardPosition,
  updateCard,
  setShowAttachDetailModal,
  setAttachDetailData,
  setShowAddBoardModal,
  addPersonalBoard,
  addRecentBoard,
  setPersonalBoard,
  setRecentBoard,
  setShowSubHeaderMoreMenu,
  setShowConfirmModal,
  deletePeronalBoard,
  addColumnToBoard,
  setBoardCols,
  setCurBoardColId,
  removeBoardCol
} = trelloSlice.actions;

export default trelloSlice;
