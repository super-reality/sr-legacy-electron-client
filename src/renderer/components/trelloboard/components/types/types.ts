

export type Comment = {  
  _id: string,
  body: string,
  createdAt: string,
  cardId: string,
  commentedBy: string
}

export type Attachment = {
  // fileName : string,
  // createdAt: string,
  // link : string,  
  // id: string

  createdAt: string,
  _id: string,
  cardId: string,
  fileName: string,
  link: string,
  uploadedBy: string,
  

}

export type CardDataInterface = {
  _id: string,
  boardId:string,
  boardColId: string,  
  title: string ,
  createdBy?: string,
  archived? : boolean,  
  img?: string ,
  subtitle?: string,
  description?: string,
  comments?:Comment[],
  attaches?: Attachment[],
  coverImage? : string,
  createdAt?: string
}



export type BoardColumnProps = {
  _id: string,
  archived: boolean,
  createdAt: string,
  boardId: string,
  col: number,
  title?: string,
  data?: CardDataInterface[]
}

export const CloneBoardColumnProps = (data : BoardColumnProps)=>{
  const {
    _id,
    archived,
    createdAt,
    boardId,    
    col,
    title
  } = data
  const newOne = {
    _id,
    archived,
    createdAt,
    boardId,    
    col,
    title
  } as BoardColumnProps
  if(data.data){
    newOne.data = data.data.map(one=>one)
  }

  return newOne

}


export type BoardData = {
  _id: string,
  title: string,
  ownerId: string,
  createdAt: string,
  // updatedAt: string,
  cols?: BoardColumnProps[],
  isPublic?: boolean
}

export const CloneBoard = (a : BoardData)=>{

  const {
    _id,
    title,
    ownerId,
    createdAt,
    isPublic
    // updatedAt
  }  = a

  const newData = {
    _id,
    title,
    ownerId,
    createdAt,
    isPublic
    // updatedAt
  } as BoardData
  if(a.cols){
    newData.cols = a.cols && a.cols.map(one=>CloneBoardColumnProps(one))
  }
  
  return newData
}
  

export type ColumnDataInterface = {
  data?: CardDataInterface[]
}



export interface BoardColCardProps  {
  col: number,
  row: number,
  data : CardDataInterface
}

export type RowCol = {
  row: number,
  col: number
}

export type Position = {
  x: number,
  y: number,
  top: number,
  left: number,
  right: number,
  bottom : number,    
  width: number,
  height: number
}


export type BoardColPayloadType = {
  boardId: string,
  cols :  BoardColumnProps[]  | undefined
}
