

export type Comment = {  
  body: string,
  created_at: string
}

export type Attachment = {
  fileName : string,
  createdAt: string,
  link : string,  
  id: string
}

export type CardDataInterface = {
  key:number,
  title: string ,
  img?: string ,
  subtitle?: string,
  description?: string,
  comments?:Comment[],
  attaches?: Attachment[],
  coverImage? : string
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
    col,
    title
  } = data
  const newOne = {
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
  cols?: BoardColumnProps[]
}

export const CloneBoard = (a : BoardData)=>{

  const {
    title,
    ownerId,
    createdAt,
    // updatedAt
  }  = a

  const newData = {
    title,
    ownerId,
    createdAt,
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
