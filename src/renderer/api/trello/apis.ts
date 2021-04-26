import Axios, { AxiosResponse } from "axios";
import { 
    ApiError, ApiOk, 

} 
from "../types";
import { API_URL } from "../../constants";
import reduxAction from "../../redux/reduxAction";
import store from "../../redux/stores/renderer";
import { 
    Attachment,
    BoardColCardProps,
    BoardColPayloadType,
    BoardColumnProps, 
    BoardData, 
    CardDataInterface,
    Comment
} from "../../components/trelloboard/components/types/types";

import { 
    IBoardRes, 
    IGetAllBoard, 
    INewBoardCol, 
    IGetAllBoardCols,
    ICardRes,
    ICardCommentRes,
    IGetAllCardsInBoard,
    IGetAllCommentsOnCard,
    ICreateAttach
} from "./types"


import {
    handleBoardCreate,
    handleDeleteBoard,
    handleGetAllBoard,
    handleBoardColCreate,
    handleGetAllBoardCols,
    handleDeleteBoardCol,
    handleCardCreate,
    handleDeleteCard,
    handleCardCommentCreate,
    handleDeleteCardComment,
    handleUpdateComment,
    handleGetAllCardsInBoard,
    handleGetAllCommentsOnCard,
    handleGetAllPublicBoard,
    handleCreateAttach,
    handleDeleteCardAttachment,
    handleUpdateCard
} from "./handler"



export function newBoard(
    title: string,
    isPublic: boolean
): Promise<void> {
    const payload = {
        title,
        isPublic
    };
    return Axios.post<IBoardRes>(
        `${API_URL}boards/create`,
        payload
    ).then(handleBoardCreate)
    .then((data: BoardData) => {
        
        console.log('isPublic: data.isPublic > ', data.isPublic)

        if(data.isPublic){
            console.log('add new board to public board')
            reduxAction(store.dispatch, {
                type: "ADD_PUBLIC_BOARD",
                arg: data,
            });
        }else{
            console.log('add new board to personal board')
            reduxAction(store.dispatch, {
                type: "ADD_PERSONAL_BOARD",
                arg: data,
            });
        }

    })
    .catch(console.error);
}



export function getAllBoard(): Promise<BoardData[] | ApiError> {
    return new Promise((resolve, reject) => {
      Axios.get<IGetAllBoard | ApiError>(`${API_URL}boards`)
        .then(handleGetAllBoard)
        .then(data=>{
            if(Array.isArray(data)){
                console.log('all board: ', data)
                reduxAction(store.dispatch, {
                    type: "SET_PERSONAL_BOARD",
                    arg: data
                })
            }            
        })
        .catch(reject);
    });
  }


export function closeBoard(
    id: string
): Promise<void> {
    
    return Axios.delete<ApiError>(
        `${API_URL}boards/${id}`
    ).then(handleDeleteBoard)
    .then((_: ApiOk) => {
        reduxAction(store.dispatch, {
            type: "DELETE_PERSONAL_BOARD",
            arg: id,
        });
        reduxAction(store.dispatch, {
            type: "SET_BOARD_DATA",
            arg: null,
        });
        
        
    })
    .catch(console.error);
}

  


export function newBoardCol(
    boardId: string,
    col: number,
    title: string
): Promise<void> {
    const payload = {
        title,
        boardId,
        col
    };
    return Axios.post<INewBoardCol>(
        `${API_URL}boards/item/create`,
        payload
    ).then(handleBoardColCreate)
    .then((data: BoardColumnProps) => {


        reduxAction(store.dispatch, {
            type: "ADD_COL_TO_BOARD",
            arg: data,
        });
    })
    .catch(console.error);
}


export function getAllBoardColumns(boardId: string): Promise<BoardColumnProps[] | ApiError> {
    return new Promise((resolve, reject) => {
      Axios.get<IGetAllBoardCols | ApiError>(`${API_URL}boards/items/${boardId}`)
        .then(handleGetAllBoardCols)
        .then(data=>{
            if(Array.isArray(data)){

                const colData : BoardColPayloadType = {
                    boardId: boardId,
                    cols: data
                }
                reduxAction(store.dispatch, {
                    type: "SET_BOARD_COLS",
                    arg: colData
                })
                
            }   
            resolve(data)         
        })
        .catch(reject);
    });
}


export function removeBoardCol(
    id: string
): Promise<void> {
    
    return Axios.delete<ApiError>(
        `${API_URL}boards/item/${id}`
    ).then(handleDeleteBoardCol)
    .then((_: ApiOk) => {

        reduxAction(store.dispatch, {
            type: "REMOVE_BOARD_COL",
            arg: id,
        });
    
        
    })
    .catch(console.error);
}


export function newCard(
    boardId:  string,
    boardColId: string,
    title: string,
    row: number,
    description: string,
    coverImage: string,
): Promise<void> {
    const payload = {
        boardId, boardColId, title, row, description, coverImage
    };
    return Axios.post<ICardRes | ApiError>(
        `${API_URL}cards/create`,
        payload
    ).then(handleCardCreate)
    .then((data: CardDataInterface | undefined) => {

        if(data){
            reduxAction(store.dispatch, {
                type: "ADD_CARD",
                arg: data,
            });
        }
        
    })
    .catch(ex=>{
        console.error(ex)
        // alert(ex.message)
    })
}


export function removeCard(
    id: string
): Promise<void> {
    
    return Axios.delete<ApiError>(
        `${API_URL}cards/${id}`
    ).then(handleDeleteCard)
    .then((_: ApiOk) => {

        reduxAction(store.dispatch, {
            type: "REMOVE_CARD",
            arg: id,
        });
            
    })
    .catch(console.error);
}




export function createCardComment(   
    cardId: string,
    body: string    
): Promise<void> {
    const payload = {
        cardId,
        body
    };
    return Axios.post<ICardCommentRes | ApiError>(
        `${API_URL}cardComment/create`,
        payload
    ).then(handleCardCommentCreate)
    .then((data: Comment | undefined) => {
        console.log('Comment Create Response : ', data)
        if(data){

            reduxAction(store.dispatch, {
                type: "ADD_CARD_COMMENT",
                arg: data,
            });
        }
        
    })
    .catch(ex=>{
        console.error(ex)
        // alert(ex.message)
    })
}

export function removeCardComment(
    comment: Comment
): Promise<void> {
    
    return Axios.delete<ApiError>(
        `${API_URL}cardComment/${comment._id}`
    ).then(handleDeleteCardComment)
    .then((_: ApiOk) => {

        reduxAction(store.dispatch, {
            type: "REMOVE_CARD_COMMENT",
            arg: comment,
        });
            
    })
    .catch(console.error);
}


export function updateCardComment(
    cardId: string, commentId: string, body: string
): Promise<void> {
    
    return Axios.put<ApiError>(
        `${API_URL}cardComment/${commentId}`,
        {
            cardId:cardId,
            body:body
        }
    ).then(handleUpdateComment)
    .then((_: ApiOk) => {

        // update comment

        reduxAction(store.dispatch, {
            type: "UPDATE_CARD_COMMENT",
            arg: {
                cardId, commentId, body
            },
        });
            
    })
    .catch(console.error);
}


export function getAllCardsById(boardId: string): Promise<CardDataInterface[] | ApiError> {
    return new Promise((resolve, reject) => {
      Axios.get<IGetAllCardsInBoard | ApiError>(`${API_URL}cards/board/${boardId}`)
        .then(handleGetAllCardsInBoard)
        .then(data=>{
            if(Array.isArray(data)){

                reduxAction(store.dispatch, {
                    type: "SET_CARDS_ON_BOARD",
                    arg: data
                })
                
            }   
            resolve(data)         
        })
        .catch(reject);
    });
}


export function getAllCommentsByCardId(cardId: string): Promise<Comment[] | ApiError> {
    return new Promise((resolve, reject) => {
      Axios.get<IGetAllCommentsOnCard | ApiError>(`${API_URL}cardComment/card/${cardId}`)
        .then(handleGetAllCommentsOnCard)
        .then(data=>{
            if(Array.isArray(data)){

                reduxAction(store.dispatch, {
                    type: "SET_COMMENTS_ON_CARD",
                    arg: data
                })                
            }   
            resolve(data)         
        })
        .catch(reject);
    });
}


export function getAllPublicBoards(): Promise<BoardData[] | ApiError> {
    return new Promise((resolve, reject) => {
      Axios.post<IGetAllBoard | ApiError>(`${API_URL}boards/public`, {}) 
        .then(handleGetAllPublicBoard)
        .then(data=>{

            if(Array.isArray(data)){
                console.log('getAllPublicBoards: ', data)

                reduxAction(store.dispatch, {
                    type: "SET_PUBLIC_BOARDS",
                    arg: data
                })
                
            }        
            resolve(data)
        })
        .catch(reject);
    });
  }

  

  export function createAttachment(
    cardId: string, fileName: string, link: string
  ): Promise<void> {

    const payload = {
        cardId,
        fileName,
        link
    };

    return new Promise((resolve, reject) => {
    

      Axios.post<ICreateAttach | ApiError>(`${API_URL}trelloAttachment/create`, payload) 
        .then(handleCreateAttach)
        .then(data=>{
            if(data){
                console.log('added attachment data: ', data)

                reduxAction(store.dispatch, {
                    type: "ADD_ATTACH_CUR_CARD",
                    arg: data
                })
            }else{
                reject(new Error('Failed to create attachment'))
            }
                  
            resolve()
        })
        .catch(reject);
    });
  }




  export function removeCardAttach(
    attachment: Attachment
): Promise<void> {
    
    return Axios.delete<ApiError>(
        `${API_URL}trelloAttachment/${attachment._id}`
    ).then(handleDeleteCardAttachment)
    .then((_: ApiOk) => {

        reduxAction(store.dispatch, {
            type: "REMOVE_CARD_ATTACHMENT",
            arg: attachment,
        });
            
    })
    .catch(console.error);
}



export function updateCard(
    card : CardDataInterface, newTitle: string, newCol: number, newRow: number,  newDesc : string, newCoverImg: string
): Promise<void> {
    const payload = {
        "card_id": card._id,
        "boardId": card.boardId,
        "boardColId": card.boardColId,
        "title": newTitle,
        "row": newRow,
        "description": newDesc,
        "coverImage": newCoverImg
    }    
    return Axios.put<ApiError>(
        `${API_URL}cards`,
        payload
    ).then(handleUpdateCard)
    .then((_: ApiOk) => {

        // update comment
        const updatedcard : BoardColCardProps = {
            col:newCol,
            row:newRow,
            data: {
                ...card,
                title: newTitle,
                // row: newRow,
                description: newDesc,
                coverImage: newCoverImg
            }
        }
        reduxAction(store.dispatch, {
            type: "UPDATE_CARD",
            arg: updatedcard,
        });
            
    })
    .catch(console.error);
}








const apis = {
    newBoard,
    getAllBoard,
    closeBoard,
    removeBoardCol
}

export default apis;