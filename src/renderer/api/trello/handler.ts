
import { AxiosResponse } from "axios";

import { Attachment, BoardColumnProps, BoardData, CardDataInterface, Comment } from "../../components/trelloboard/components/types/types";
import apiErrorHandler from "../apiErrorHandler";
import { ApiError, ApiOk } from "../types";
import { 
    IBoardRes, 
    ICardCommentRes, 
    ICardRes, 
    IGetAllBoard, 
    IGetAllBoardCols, 
    IGetAllCardsInBoard, 
    INewBoardCol, 
    ICardResType,
    IGetAllCommentsOnCard,
    ICommentRes,
    ICreateAttach
} from "./types"



export function apiResHandler<T>(
    res: AxiosResponse<T>
): Promise<T> {
    return new Promise((resolve, reject) => {
        if (res.status == 200 || res.status == 201) {
            resolve(res.data);
        } else {
            reject(new Error(`Http error code: ${res.status}`));
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
                isPublic: d.isPublic,
                ownerId: d.ownerId as string,
                createdAt: d.createdAt
            }

            resolve(board)
        })
        .catch(reject)
    })
}



export function handleCreateAttach(
    res:  AxiosResponse<ICreateAttach | ApiError>
): Promise<Attachment | undefined>{

    return new Promise((resolve, reject)=>{        
        apiResHandler<ICreateAttach | ApiError>(res)
        .then(d=>{

            if(d.err_code){
                alert(d.message)
                resolve(undefined)
            }else{
                const resAttach = d.attachment
                if(resAttach){
                    const attach : Attachment = {
                        _id: resAttach._id,
                        cardId: resAttach.cardId,
                        fileName: resAttach.fileName,
                        link: resAttach.link,
                        createdAt: resAttach.createdAt,
                        uploadedBy: resAttach.uploadedBy
                    }
    
                    resolve(attach)
                }else{
                    resolve(undefined)
                }
            }

           
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
                    ownerId: typeof(one.ownerId ) == 'object' ? one.ownerId._id : one.ownerId ,
                    isPublic: one.isPublic,
                } as BoardData
            })

            resolve(boards)

        })
        .catch(reject)
    })
}

export function handleGetAllPublicBoard(
    res: AxiosResponse<IGetAllBoard | ApiError>
): Promise<BoardData[] | ApiError>{
    console.log('handleGetAllPublicBoard res : ', res)

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
                    ownerId: typeof(one.ownerId ) == 'object' ? one.ownerId._id : one.ownerId ,
                    isPublic: one.isPublic,
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




export function handleCardCreate(
    res:  AxiosResponse<ICardRes | ApiError>
): Promise<CardDataInterface | undefined>{

    return new Promise((resolve, reject)=>{
        apiResHandler<ICardRes | ApiError>(res)
            .then(d=>{
                if(d.err_code){
                    alert(d.message)
                    resolve(undefined)
                }else{
                    const resCard = d.card
                    if(resCard){
                        const card : CardDataInterface = {
    
                            _id: resCard._id,
                            boardId:resCard.boardId,
                            boardColId: resCard.boardColId,  
                            title: resCard.title,
                            archived: resCard.archived,
                            createdAt: resCard.createdAt,
                            createdBy: resCard.createdBy,                       
                            coverImage : resCard.coverImage,
                            description: resCard.description
    
                        }
        
                        resolve(card)
                    }
                }
                
                
            })
            .catch(reject)

    })
}


export function handleDeleteCard(
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





export function handleCardCommentCreate(
    res:  AxiosResponse<ICardCommentRes | ApiError>
): Promise<Comment | undefined>{

    return new Promise((resolve, reject)=>{
        apiResHandler<ICardCommentRes | ApiError>(res)
            .then(d=>{
                if(d.err_code){
                    alert(d.message)
                    resolve(undefined)
                }else{
                    const comm = d.comment
                    if(comm){                                                  
                        resolve(comm)
                    }else{
                        resolve(undefined)
                    }
                }                
                
            })
            .catch(reject)

    })
}



export function handleDeleteCardComment(
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


export function handleDeleteCardAttachment(
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

export function handleUpdateComment(
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



export function handleUpdateCard(
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


export function handleGetAllCardsInBoard(
    res: AxiosResponse<IGetAllCardsInBoard | ApiError>
): Promise<CardDataInterface[] | ApiError>{

    return new Promise<CardDataInterface[] | ApiError>((resolve, reject)=>{

        apiErrorHandler<IGetAllCardsInBoard>(res)
            .then(d=>{

                if(d.cards){
                    const cards : CardDataInterface[] = d.cards.map((one: ICardResType) =>{
                        return {
                            _id: one._id,
                            boardId: one.boardId ? one.boardId._id : '',
                            boardColId: one.boardColId._id,
                            title: one.title,
                            createdBy: one.createdBy._id,
                            archived : one.archived,  
                            img: one.coverImage,
                            subtitle: '',
                            description: one.description,
                            comments:[],
                            attaches: [],
                            coverImage : one.coverImage,
                            createdAt: one.createdAt
                        } as CardDataInterface
                    })

                    resolve(cards)
                }else{
                    resolve([])
                }
                               
            })
            .catch(reject)
    })
}


export function handleGetAllCommentsOnCard(
    res: AxiosResponse<IGetAllCommentsOnCard | ApiError>
): Promise<Comment[] | ApiError>{

    return new Promise<Comment[] | ApiError>((resolve, reject)=>{

        apiErrorHandler<IGetAllCommentsOnCard>(res)
            .then(d=>{

                if(d.comments){
                    const comments : Comment[] = d.comments.map((one: ICommentRes) =>{
                        return {
                            _id: one._id,
                            body: one.body,
                            createdAt: one.createdAt,
                            cardId: one.cardId._id,
                            commentedBy: one.commentedBy._id
                        } as Comment
                    })

                    resolve(comments)
                }else{
                    resolve([])
                }
                               
            })
            .catch(reject)
    })
}