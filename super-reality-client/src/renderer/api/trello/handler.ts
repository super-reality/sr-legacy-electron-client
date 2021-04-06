import { AxiosResponse } from "axios";

import { BoardColumnProps, BoardData } from "../../components/trelloboard/components/types/types";
import apiErrorHandler from "../apiErrorHandler";
import { ApiError, ApiOk } from "../types";
import { IBoardRes, IGetAllBoard, IGetAllBoardCols, INewBoardCol} from "./types"



export function apiResHandler<T>(
    res: AxiosResponse<T>
): Promise<T> {
    return new Promise((resolve, reject) => {
      if (res.status == 200 || res.status == 201) {        
          resolve(res.data);                
      } else {
        // Should popup the error to the screen
        // eslint-disable-next-line prefer-promise-reject-errors
        reject(`Http error code: ${res.status}`);
      }
    });
  }
  

  
export function handleBoardCreate(
    res:  AxiosResponse<IBoardRes>
): Promise<BoardData>{

    return new Promise((resolve, reject)=>{
        apiResHandler<IBoardRes>(res)
            .then(d=>{
                const board : BoardData = {
                    _id: d._id,
                    title: d.title,
                    ownerId: d.ownerId as string,
                    createdAt: d.createdAt                    
                }
                resolve(board)
            })
            .catch(reject)

    })
}

export function handleGetAllBoard(
    res: AxiosResponse<IGetAllBoard | ApiError>
): Promise<BoardData[] | ApiError>{

    return new Promise<BoardData[] | ApiError>((resolve, reject)=>{

        apiErrorHandler<IGetAllBoard>(res)
            .then(d=>{

                const boards : BoardData[] = d.boards.map(one=>{

                    return {
                        archived: one.archived,
                        createdAt: one.createdAt,
                        _id: one._id,
                        title: one.title,
                        lastSeenAt: one.lastSeenAt,
                        ownerId: one.ownerId,
                    } as BoardData
                })
                resolve(boards)
            })
            .catch(reject)
    })
}

export function handleDeleteBoard(
    res: AxiosResponse<ApiError>
): Promise<ApiOk>{

    return new Promise<ApiOk>((resolve, reject)=>{

        apiErrorHandler<ApiOk>(res)
            .then(_=>{
                const result = {
                    err_code: 0, 
                    msg : res.data.message
                } as ApiOk
                resolve(result)
            })
            .catch(reject)
    })
}


  
export function handleBoardColCreate(
    res:  AxiosResponse<INewBoardCol>
): Promise<BoardColumnProps>{

    return new Promise((resolve, reject)=>{
        apiResHandler<INewBoardCol>(res)
            .then(d=>{
                const boardCol : BoardColumnProps = {
                    _id: d._id,
                    title: d.title,
                    archived: d.archived,
                    createdAt: d.createdAt,
                    boardId: d.boardId,
                    col: d.col
                }

                resolve(boardCol)
            })
            .catch(reject)

    })
}





export function handleGetAllBoardCols(
    res: AxiosResponse<IGetAllBoardCols | ApiError>
): Promise<BoardColumnProps[] | ApiError>{

    return new Promise<BoardColumnProps[] | ApiError>((resolve, reject)=>{

        apiErrorHandler<IGetAllBoardCols>(res)
            .then(d=>{
                if(d.boardItems){
                    const cols : BoardColumnProps[] = d.boardItems.map(one=>{
                        return {
                            _id: one._id,
                            archived: one.archived,
                            createdAt: one.createdAt,
                            boardId: one.boardId,
                            col: one.col,
                            title: one.title,
                        } as BoardColumnProps
                    })
                    resolve(cols)
                }else{
                    resolve([])
                }
                               
            })
            .catch(reject)
    })
}




export function handleDeleteBoardCol(
    res: AxiosResponse<ApiError>
): Promise<ApiOk>{

    return new Promise<ApiOk>((resolve, reject)=>{

        apiErrorHandler<ApiOk>(res)
            .then(_=>{
                const result = {
                    err_code: 0, 
                    msg : res.data.message
                } as ApiOk
                resolve(result)
            })
            .catch(reject)
    })
}

