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
  BoardColPayloadType,
  CloneBoardColumnProps,
  Comment,
  // CloneBoard
  // CloneBoard
} from '../../components/trelloboard/components/types/types';

const InitColumnTitles : string[] = ['Col1', 'Col2', 'Col3', 'Col4', 'Col5', 'Col6', 'Col7', 'Col8', 'Col9']


export type TrelloState = {
  isShowBoardMenu: boolean, // true disables auth !  
  
  recentBoards : BoardData[] | null,
  personalBoards : BoardData[] | null,
  publicBoards : BoardData[] | null,
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
  publicBoards: [],
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

    setBoardData:(state: TrelloState , action: PayloadAction<BoardData | null | undefined>):void=>{
      state.boardData = action.payload
      console.log('setboarddata called : ', action.payload)
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
      
      if(state.detailCardData){
        
        const comments = state.detailCardData.comments?.map(one=>one)
        const attaches = state.detailCardData.attaches?.map(one=>one)
        const newCard : CardDataInterface = action.payload.data
        state.detailCardData = {
          ...newCard,
          comments: comments,
          attaches: attaches
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
    addPublicBoard :  (state : TrelloState, action: PayloadAction<BoardData>):void=>{
      
      if(state.publicBoards){
        state.publicBoards.push(action.payload)
      }else{
        state.publicBoards = [action.payload]
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
    setPublicBoards :  (state : TrelloState, action: PayloadAction<BoardData[]>):void=>{      
      state.publicBoards = action.payload
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

    addCard:  (state : TrelloState, action: PayloadAction<CardDataInterface>):void=>{
     
      if(state.personalBoards){
        console.log('begin foreach')
        state.personalBoards.forEach(board=>{
          console.log('perosnal boards : ', board._id, action.payload.boardId, 'compareing: ', board._id == action.payload.boardId)
          if(board._id == action.payload.boardId){
            console.log('perosnal boards ==: ', board.cols?.length)

            if(board.cols){
              const tempCols = board.cols.map(one=>CloneBoardColumnProps(one))
              tempCols.forEach(col=>{
                console.log('col : ', col._id, action.payload.boardColId)
                if(col._id.trim() == action.payload.boardColId.trim()){
                  console.log('coldata : ',col.data)
                  if(col.data){
                    col.data.push(action.payload)
                  }else{
                    col.data = [action.payload]
                  }
                }
              })

              board.cols = tempCols;

            }
            
          }
        })

      } 

      if(state.boardData && state.boardData._id == action.payload.boardId && state.boardData.cols){
        
        const tempCols = state.boardData.cols.map(one=>CloneBoardColumnProps(one))
        tempCols.forEach(col=>{
          if(col._id == action.payload.boardColId){
            if(col.data){
              col.data.push(action.payload)
            }else{
              col.data = [action.payload]
            }
          }
        })       
        state.boardData.cols = tempCols;
        
      }
    },

    removeCard: (state : TrelloState, action: PayloadAction<string>) : void=>{
      if(state.boardData && state.detailCardData){

        const colId = state.detailCardData.boardColId
        // state.boardData.cols = state.boardData.cols?.filter(one=>one._id != action.payload)
        const tempCols = state.boardData.cols?.map(one=>CloneBoardColumnProps(one))
        tempCols!.forEach(col=>{
          if(col._id == colId){
            col.data = col.data?.filter(card=>card._id != action.payload)
          }
        })  

        state.boardData.cols = tempCols?.map(one=>CloneBoardColumnProps(one))

      }
      
    },
    addCardComment : (state: TrelloState, action : PayloadAction<Comment>): void=>{
      if(state.boardData && state.detailCardData){
        console.log('add card Comment : ', action.payload)

        let comments = state.detailCardData.comments?.map(one=>{
          const clone : Comment = {
            _id : one._id,
            body : one.body,
            createdAt: one.createdAt,
            cardId: one.cardId,
            commentedBy: one.commentedBy
          }
          return clone
        })

        if(comments){
          comments.push(action.payload)
        }else{
          comments = [action.payload]
        }
        
        state.detailCardData.comments = comments

        console.log('detailCardData : ', state.detailCardData.comments)

        const tempCols = state.boardData.cols?.map(one=>CloneBoardColumnProps(one))
        if(tempCols){
          tempCols!.forEach(col=>{
            if(col._id == state.detailCardData?.boardColId){
              const cards = col.data?.map(one=>one)
              if(cards){
                cards!.forEach(card=>{
                  if(card._id == state.detailCardData?._id){
                    if(card.comments){
                      card.comments.push(action.payload)
                    }else{
                      card.comments = [action.payload]
                    }
                  }
                })
              }              
            }
          })  
        }
        

        state.boardData.cols = tempCols

        console.log('state.boardData.cols : tempCols > ', tempCols)
      }
    },

    removeCardComment:(state : TrelloState , action: PayloadAction<Comment>): void =>{
      if(state.boardData){
        const tempCols = state.boardData.cols?.map(one=>CloneBoardColumnProps(one))
        tempCols!.forEach(col=>{
          if(col.data){
            col.data!.forEach(card=>{
              if(card._id == action.payload.cardId){
                const newComments = card.comments?.filter(one=>one._id != action.payload._id)
                card.comments = newComments
              }
            })
          }
          
        })
      } 
      
      if(state.detailCardData){
        const comments = state.detailCardData.comments?.filter(one=>one._id != action.payload._id)
        state.detailCardData.comments = comments
        
      }
    },

    removeCArdAttachment: (state : TrelloState , action: PayloadAction<Attachment>): void =>{
      if(state.boardData){
        const tempCols = state.boardData.cols?.map(one=>CloneBoardColumnProps(one))
        tempCols!.forEach(col=>{
          if(col.data){
            col.data!.forEach(card=>{
              if(card._id == action.payload.cardId){
                const newAttaches = card.attaches?.filter(one=>one._id != action.payload._id)
                card.attaches = newAttaches
              }
            })
          }
          
        })
      } 
      
      if(state.detailCardData){
        const atts = state.detailCardData.attaches?.filter(one=>one._id != action.payload._id)
        state.detailCardData.attaches = atts
        
      }
    },

    updateCardComment: (state : TrelloState , action: PayloadAction<{cardId: string, body: string, commentId: string}>): void =>{
      if(state.boardData){
        const tempCols = state.boardData.cols?.map(one=>CloneBoardColumnProps(one))
        tempCols!.forEach(col=>{
          if(col.data){
            col.data!.forEach(card=>{
              if(card._id == action.payload.cardId){
                if(card.comments && card.comments.length){
                  card.comments.forEach(oneComment => {
                    if(oneComment._id == action.payload.commentId){
                      oneComment.body = action.payload.body
                    }
                  })
                }                
              }
            })
          }
          
        })
      } 
      
      if(state.detailCardData){
        const comments = state.detailCardData.comments?.map(one=>{
          if(one._id == action.payload.commentId){
            return {
              ...one,
              body: action.payload.body
            }
          }
          return one
          
        })

        state.detailCardData.comments = comments
        
      }
    },

    setCardsOnBoard:(state : TrelloState , action: PayloadAction<CardDataInterface[]>):void=>{
      if(state.boardData){

        const tempCols = state.boardData.cols?.map(one=>CloneBoardColumnProps(one))

        const cards = action.payload
        if(cards && cards.length){
          cards.forEach(card=>{
            if(tempCols){
              tempCols!.forEach(col=>{
                if(col._id == card.boardColId){
                  if(col.data){
                    col.data.push(card)
                  }else{
                    col.data = [card]
                  }
                }
                
              })
            }
           
          })
        }
        

        state.boardData.cols = tempCols?.map(one=>CloneBoardColumnProps(one))
      
      } 
    },

    setCommentsOnCard:(state : TrelloState , action: PayloadAction<Comment[]>):void=>{
      if(state.detailCardData){
        
        state.detailCardData.comments = action.payload
        
      }
    },

    addAttachCurCard: (state : TrelloState, action: PayloadAction<Attachment>):void=>{
      if(state.detailCardData){
        if(state.detailCardData.attaches){
          state.detailCardData.attaches.push(action.payload)
        }else{
          state.detailCardData.attaches = [action.payload]
        }
      }
    }

    

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
  addPublicBoard,
  addRecentBoard,
  setPersonalBoard,
  setRecentBoard,
  setShowSubHeaderMoreMenu,
  setShowConfirmModal,
  deletePeronalBoard,
  addColumnToBoard,
  setBoardCols,
  setCurBoardColId,
  removeBoardCol,
  addCard,
  removeCard,
  addCardComment,
  removeCardComment,
  updateCardComment,
  setCardsOnBoard,
  setCommentsOnCard,
  setPublicBoards,
  addAttachCurCard,
  removeCArdAttachment
} = trelloSlice.actions;

export default trelloSlice;
