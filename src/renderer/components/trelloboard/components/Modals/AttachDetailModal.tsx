
import React from "react";

import {
  useSelector,
  useDispatch
} from "react-redux";
import { animated, useSpring } from "react-spring";

import reduxAction from "../../../../redux/reduxAction";
import {
  AppState
} from "../../../../redux/stores/renderer";

import "./Modal.scss";

import CloseIcon from "../../../../../assets/images/trello/close.png"
import Card from "../../../../../assets/images/trello/card.png"
// import ListImg from "../../../../../assets/images/trello/list.png"
// import Actimg from "../../../../../assets/images/trello/actbars.png"

// import attachIcon from "../../../../../assets/images/trello/attach.png"

// import InfoTemp from "../../../../../assets/images/trello/info-temp.png"

import {
    BoardColCardProps,
    CardDataInterface,
    // Comment,
    RowCol,
    Attachment
} from "../types/types"

// export interface AttachDetailModalProps {
//     att? : Attachment
// }


export default function AttachDetailModal() {

  const dispatch = useDispatch()

  const showAttachDetailModal = useSelector((state: AppState) => state.trello.showAttachDetailModal);
  const attachDetailData : Attachment | null = useSelector((state : AppState)=> state.trello.attachDetailData)
  const detailCardData : CardDataInterface | null = useSelector((state : AppState)=> state.trello.detailCardData)
  const detailCardPosition : RowCol | null = useSelector((state : AppState)=> state.trello.detailCardPosition)
  const expandOpacity = useSpring({
    from: { opacity: showAttachDetailModal ? 0 : 1 },
    to: { opacity: showAttachDetailModal ? 1 : 0 },    
  } as any);


    if(!attachDetailData){
        return null
    }

 

  const handleClick = () => {

    reduxAction(dispatch, {
      type: "SET_SHOW_ATTACH_DETAIL_MODAL",
      arg: false,
    });

  };


  const handleOverlayClick = (e : React.MouseEvent<Element, MouseEvent>)=>{
    e.stopPropagation()
    reduxAction(dispatch, {
        type: "SET_SHOW_ATTACH_DETAIL_MODAL",
        arg: false,
    });
    reduxAction(dispatch, {
        type: "SET_ATTACH_DETAIL_DATA",
        arg: null,
    });
  }
 

  const onRemoveAttach = (att: Attachment)=>{
    
  
        if(detailCardPosition && detailCardData && detailCardData.attaches && detailCardData.attaches.length){
            const newlist = detailCardData.attaches.filter(one=>one._id != att._id)
    
            const newData : BoardColCardProps = {
                data:{
                    ...detailCardData,
                    attaches : newlist
                } as CardDataInterface,
    
                row: detailCardPosition.row,
                col: detailCardPosition.col                    
            }
    
            reduxAction(dispatch, {
                type: "UPDATE_CARD",
                arg: newData
            })
    
            reduxAction(dispatch, {
                type: "SET_DETAIL_CARD_DATA",
                arg: newData.data,
            });        
        }   
   
    
  }

  const onClickMakeCover = (oneAtt : Attachment) =>{
    if(detailCardPosition && detailCardData){
    
        const newData : BoardColCardProps = {
            data:{
                ...detailCardData,
                coverImage: oneAtt.link
            } as CardDataInterface,

            row: detailCardPosition.row,
            col: detailCardPosition.col                    
        }

        reduxAction(dispatch, {
            type: "UPDATE_CARD",
            arg: newData
        })

        reduxAction(dispatch, {
            type: "SET_DETAIL_CARD_DATA",
            arg: newData.data,
        });        
    }
  }




  return (
    <animated.div 
        className={ showAttachDetailModal ? "modalRoot-overlay" : "modalRoot-overlay d-none"} 
        style={{ ...expandOpacity }}
        draggable={false}
        onDragStart={e=>e.stopPropagation()}
        onClick={e=>{handleOverlayClick(e)}}                  
    >
        
        <animated.div className="datailModalContainer bg-transparent width-auto no-shadow" onClick={_=>{handleClick() }}    >
            <div className="imgDetailCloseButton" onClick={handleClick}>
                <img src={CloseIcon} />
            </div>
            
            {
                attachDetailData && attachDetailData.link &&(
                    <div className="attDetailModalImgContainer" onClick={e=>{e.stopPropagation(); handleClick() }}>
                        <img src={attachDetailData.link} />
                    </div>
                )
            }

            <div className="imgDetailBottomContainer" >
                <div className="fileName">{attachDetailData.fileName}</div>
                <div className="date">Added  {attachDetailData.createdAt}</div>
                
                <div className="attachLinkButtons">
                    <a  onClick={()=>onRemoveAttach(attachDetailData)}>
                        <img src={Card}/>
                        Remove Attachment
                    </a>   
                    {/* <a  onClick={()=>onClickMakeCover(attachDetailData)}>
                        <img src={Card}/>
                        Make cover
                    </a>                                                                */}
                </div>
                
            </div>

            
            
           
        </animated.div>
    </animated.div>
  );
}

