import { BoardColumnProps } from "../../components/trelloboard/components/types/types";
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

export interface IGetAllBoardCols {
    err_code: CodeSuccess,
    boardItems: BoardColumnProps[] | undefined | null
}

