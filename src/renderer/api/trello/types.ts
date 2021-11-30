import { Attachment, BoardColumnProps, CardDataInterface, Comment } from "../../components/trelloboard/components/types/types";
import { CodeSuccess, ErrorCodes } from "../types";

export interface IOwner {
    _id: string,
    firstname: string,
    lastname: string
}

export interface IBoardRes {
    archived : boolean,
    createdAt : string,
    _id : string,
    title : string,
    lastSeenAt : string|null,
    ownerId : string | IOwner,
    isPublic?: boolean
}

export interface IGetAllBoard {
    err_code : CodeSuccess,
    boards: IBoardRes[]
}

export interface INewBoardCol {
    col: number,
    archived: boolean,
    createdAt: string,
    _id: string,
    boardId: string,
    title: string,
    __v: number
}

export interface ICreateAttach{
    err_code : CodeSuccess,
    attachment: Attachment
}

export interface ICardResType{
    description : string | undefined | null,
    coverImage : string | null | undefined,
    archived : boolean,
    updatedBy : string | null | undefined,
    createdAt : string | null | undefined,
    _id : string,
    boardId : {
        archived : boolean,
        createdAt : string,
        _id : string,
        title : string,
        lastSeenAt : string | null | undefined,
        ownerId : string,
        __v : number 
    },
    boardColId: {
        col: number,
        archived: boolean,
        createdAt: string,
        _id: string,
        boardId: string,
        title: string | undefined,
        __v: number
    },
    title: string,
    createdBy: {
        _id: string,
        firstname: string | undefined | null,
        lastname: string  | undefined | null
    },
    __v: number
}

export interface ICommentRes{
    createdAt: string | undefined | null,
    _id: string | null | undefined,
    cardId: {
        description: string | undefined | null,
        coverImage: string | null | undefined,
        archived: boolean,
        updatedBy: string | null | undefined,
        createdAt: string | null | undefined,
        _id: string | null | undefined,
        boardId: string | null | undefined,
        boardColId: string | null | undefined,
        title: string  | null | undefined,
        createdBy: string | null | undefined,
        __v: number
    },
    body: string | null | undefined,
    commentedBy: {
        _id: string ,
        firstname: string | null | undefined,
        lastname: string | null | undefined
    },
    __v: number
}


export interface IGetAllBoardCols {
    err_code: CodeSuccess,
    boardItems: BoardColumnProps[] | undefined | null
}


export interface ICardRes {
    err_code: CodeSuccess,
    card: CardDataInterface | undefined | null
}





export interface ICardCommentRes {
    err_code: CodeSuccess,
    comment: Comment | undefined
}


export interface IGetAllCardsInBoard{
    err_code: CodeSuccess,
    cards: ICardResType[] | undefined | null
}

export interface IGetAllCommentsOnCard{
    err_code: CodeSuccess,
    comments: ICommentRes[] | undefined | null
}