import Axios from "axios";
import { 
    ApiError, ApiOk, 
    // ApiSucess 
} 
from "../types";
import { API_URL } from "../../constants";
import reduxAction from "../../redux/reduxAction";
import store from "../../redux/stores/renderer";
import { 
    BoardColPayloadType,
    BoardColumnProps, 
    BoardData 
} from "../../components/trelloboard/components/types/types";

import { 
    IBoardRes, IGetAllBoard, INewBoardCol, IGetAllBoardCols
} from "./types"


import {
    handleBoardCreate,
    handleDeleteBoard,
    handleGetAllBoard,
    handleBoardColCreate,
    handleGetAllBoardCols,
    handleDeleteBoardCol
} from "./handler"



export function newBoard(
    title: string
): Promise<void> {
    const payload = {
        title,
    };
    return Axios.post<IBoardRes>(
        `${API_URL}boards/create`,
        payload
    ).then(handleBoardCreate)
    .then((data: BoardData) => {
        reduxAction(store.dispatch, {
            type: "ADD_PERSONAL_BOARD",
            arg: data,
        });
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


const apis = {
    newBoard,
    getAllBoard,
    closeBoard,
    removeBoardCol
}

export default apis;