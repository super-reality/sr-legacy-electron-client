
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
import ListImg from "../../../../../assets/images/trello/list.png"
import Actimg from "../../../../../assets/images/trello/actbars.png"

import attachIcon from "../../../../../assets/images/trello/attach.png"

// import InfoTemp from "../../../../../assets/images/trello/info-temp.png"
import AttachDetailModal from "./AttachDetailModal"

import {
    BoardColCardProps,
    CardDataInterface,
    Comment,
    RowCol,
    Attachment
} from "../types/types"

export default function CardDetailModal() {

  const dispatch = useDispatch()

  const showCardDetailModal = useSelector((state: AppState) => state.trello.showCardDetailModal);
  const detailCardData : CardDataInterface | null = useSelector((state : AppState)=> state.trello.detailCardData)
  const detailCardPosition : RowCol | null = useSelector((state : AppState)=> state.trello.detailCardPosition)
  

  const [showCommentToolBar, setShowCommentToolBar] = React.useState(false)

  const [titleEditMode, setTitleEditMode] = React.useState(false)
  const [descEditMode, setDescEditMode] = React.useState(false)


  const expandOpacity = useSpring({
    from: { opacity: showCardDetailModal ? 0 : 1 },
    to: { opacity: showCardDetailModal ? 1 : 0 },    
  } as any);

  const handleClick = () => {

    reduxAction(dispatch, {
      type: "SET_SHOW_CARD_DETAIL_MODAL",
      arg: false,
    });

  };


  const handleOverlayClick = (e : React.MouseEvent<Element, MouseEvent>)=>{
    e.stopPropagation()
    reduxAction(dispatch, {
        type: "SET_SHOW_CARD_DETAIL_MODAL",
        arg: false,
    });
    reduxAction(dispatch, {
        type: "SET_DETAIL_CARD_DATA",
        arg: null,
    });
  }
 
  const onClickTitle = (_: React.MouseEvent<Element, MouseEvent>)=>{
    setTitleEditMode(true)
    setDescEditMode(false)
  }

  const onTitleKeyUp = (e : React.KeyboardEvent<HTMLInputElement>)=>{
      
      if(e.key == 'Enter'){
          setTitleEditMode(false)
          // todo save title 
            if(detailCardPosition){

                
                const newData : BoardColCardProps = {
                    data:{
                        ...detailCardData,
                        title : e.currentTarget.value
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
  }

  const onClickCommentSave = ()=>{
      const node = document.getElementById('commentInput')
      console.log(node)
      if(node && detailCardPosition && detailCardData){
            console.log(node.innerHTML)

            // node.innerHTML = "";
            
            const newComment = {
                body : (node.textContent===undefined) ? node.innerText : node.textContent,
                created_at: new Date().toLocaleString()
            }

            const newData : BoardColCardProps = {
                data:{
                    ...detailCardData,
                    comments : detailCardData.comments && detailCardData.comments.length ? [...detailCardData.comments, newComment] : [newComment]
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
            node.innerHTML = ''
      }
      
      setShowCommentToolBar(false)
  }

  const onClickEdit = ()=>{
    setDescEditMode(true)
    setTitleEditMode(false)
  }

  const onClickSaveDesc = ()=>{
    setDescEditMode(false)
    setTitleEditMode(false)

    if(detailCardPosition){

        const node = document.getElementById('descEditContainer')
        if(node){
            const desc = (node.textContent===undefined) ? node.innerText : node.textContent;
            const newData : BoardColCardProps = {
                data:{
                    ...detailCardData,
                    description : desc
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
  }

  const onCancelDescEdit = ()=>{
    setDescEditMode(false)
    setTitleEditMode(false)
  }

  const handleAttach = ()=>{
    const filePicker = document.getElementById('attachFilePicker')
    if(filePicker){
        filePicker.click()
    }
  }

  const onClickAddAttach = ()=>{
    const filePicker = document.getElementById('attachFilePicker')
    if(filePicker){
        filePicker.click()
    }
  }
  const onRemoveAttach = (att: Attachment)=>{
    
  
        if(detailCardPosition && detailCardData && detailCardData.attaches && detailCardData.attaches.length){
            const newlist = detailCardData.attaches.filter(one=>one.id != att.id)
    
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

  const addAttach = (fileUrl : string, fileName: string)=>{
    if(detailCardPosition && detailCardData){
        
        let newAttaches : Attachment[] = [];
        const newDetailCardData = {
            ...detailCardData
        }
        if( detailCardData && detailCardData.attaches && detailCardData.attaches.length ){
            newAttaches = [
                ...detailCardData.attaches,
            ]
        }else{
            newDetailCardData.coverImage = fileUrl
        }

        const date = new Date()
        const newAtt : Attachment = {
            fileName: fileName,
            link: fileUrl,
            createdAt: `${date.toLocaleDateString()} at ${date.toLocaleTimeString()} `,
            id: Date.now().toString()
        } as Attachment

        newAttaches.push(newAtt)
        
        

        const newData : BoardColCardProps = {
            data:{
                ...newDetailCardData,
                attaches : newAttaches
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

  const onFileChange = ()=>{
    
                                                    
    const filePicker = document.getElementById('attachFilePicker') as any

    const file = filePicker?.files[0]

    if(file){
        const imgURL = URL.createObjectURL(file)
        // alert(imgURL)
        addAttach(imgURL, file.name)

    //   addImage(imgURL, file)
    }
    

  }

  const onClickAttachDetail = (oneAtt : Attachment) => {
    reduxAction(dispatch, {
        type: "SET_ATTACH_DETAIL_DATA",
        arg: oneAtt
    })
    reduxAction(dispatch, {
        type: "SET_SHOW_ATTACH_DETAIL_MODAL",
        arg: true
    })
  }



  console.log('detailCardData', detailCardData)
  return (
    <animated.div 
        className={ showCardDetailModal ? "modalRoot-overlay" : "modalRoot-overlay d-none"} 
        style={{ ...expandOpacity }}
        draggable={false}
        onDragStart={e=>e.stopPropagation()}
        onClick={e=>{handleOverlayClick(e)}}                  
    >
        
        <animated.div className="datailModalContainer" onClick={e=>{e.stopPropagation()}} onMouseDown={e=>e.stopPropagation()}     >
            {
                detailCardData && detailCardData.coverImage &&(
                    <div className="coverImageContainer">
                        <img src={detailCardData.coverImage}/>
                    </div>
                )
            }
            
            <div className="modalHeader">
                
                <div className="modalTitle" onClick={onClickTitle}>
                    <img src={Card}/>    
                    <div >
                        <div >
                            {
                                titleEditMode ? (
                                    <input type="text" className="titleInput" id="titleInput" onKeyUp={onTitleKeyUp}/>
                                ) : (
                                    <>
                                    {detailCardData?.title}
                                    </>
                                )
                            }
                            
                        </div>
                        <div className="subtitle">{detailCardData?.subtitle}</div>
                    </div>
                </div>
             
                <div className="modalClosebtn" onClick={() => { handleClick() }}>
                    <img src={CloseIcon} />
                </div>
            </div>
            <div className="modalBody">
                <div className="mainContent">
                    <div className="sectionTitle">
                        <img src={ListImg}/>                 
                        <div>Description</div>   
                        {
                            !descEditMode && <button type="button" className="btn btn-primary " onClick={onClickEdit}>Edit</button>
                        }                     
                        
                    </div>
                    
                    <div className="sectionBody">      
                    {
                        descEditMode ? (
                            <div className="descEditContainer" >
                                <div
                                    id="descEditContainer"
                                    className="commentTextArea"
                                    contentEditable
                                >
                                {detailCardData?.description}
                                </div>  
                                <div>
                                    <button type="button" className="btn btn-secondary" onClick={onClickSaveDesc}>Save</button>
                                    <button type="button" className="btn btn-primary" onClick={onCancelDescEdit}>Close</button>
                                </div>     
                            </div>     
                        ) : (
                            <div className="descEditContainer">
                               {detailCardData?.description}
                            </div>            
                        )
                    }          
                        
                    </div>

                    {
                        detailCardData && detailCardData.attaches && detailCardData.attaches.length  && (
                            <>
                                 <div className="sectionTitle">
                                    <img src={attachIcon}/>                 
                                    <div>Attachments</div>   
                                </div>
                                
                                <div className="sectionBody">                         
                                    
                                    <div className="descEditContainer" >
                                        {
                                            detailCardData.attaches.map((oneAtt: Attachment, _ : number)=>{
                                                return (
                                                    <div                                                        
                                                        className="attachRow"
                                                        key={oneAtt.id}              
                                                        onClick={()=>{onClickAttachDetail(oneAtt)}}                                          
                                                    >

                                                        <img                                                            
                                                            src={oneAtt.link}
                                                            alt={`img_att_${oneAtt.id}`}                                                            
                                                        />
                                                        <div className="attachRighContainer">
                                                            <div className="attachTitle">{oneAtt.fileName}</div>
                                                            <div className="attachedDate">Added&nbsp;{oneAtt.createdAt}</div>
                                                            <div className="attachLinkButtons">
                                                                <a  onClick={(e)=>{
                                                                    e.stopPropagation()
                                                                    onRemoveAttach(oneAtt)
                                                                }}>
                                                                    <img src={Card}/>
                                                                    Remove Attachment
                                                                </a>   
                                                                <a  onClick={(e)=>{
                                                                    e.stopPropagation()
                                                                    onClickMakeCover(oneAtt)
                                                                }}>
                                                                    <img src={Card}/>
                                                                    Make cover
                                                                </a>                                                               
                                                            </div>
                                                        </div>
                                                    </div>  
                                                )
                                               
                                            })
                                        }
                                        
                                        <div className="addAttachButton">
                                            <button type="button" className="btn btn-secondary" onClick={onClickAddAttach}> +&nbsp;Add Attachment</button>
                                            {/* <button type="button" className="btn btn-primary" onClick={onCancelDescEdit}>Close</button> */}
                                        </div>     
                                    </div>     
                                </div>

                            </>
                        )
                    }

                   
                    <div className="sectionTitle">
                        <img src={Actimg} width="20px" height="20px"/>                 
                        <div>Activity</div>                        
                        
                    </div>

                    <div className="comment">
                        <div className="profile">
                            <span>TE</span>
                        </div>
                        <div className="w-100 commentEditContainer">
                            <div 
                                id="commentInput"
                                className={showCommentToolBar ? "commentTextArea borderTop " : "commentTextArea borderTop borderBottom"} 
                                role="textbox" 
                                contentEditable
                                onFocus={_=>{
                                    setShowCommentToolBar(true)
                                    setDescEditMode(false)
                                    setTitleEditMode(false)
                                }}
                                onBlur={_=>{
                                    // setShowCommentToolBar(false)
                                }}
                            />       
                            {
                                showCommentToolBar && (
                                    <div className="commentToolBar" contentEditable={false}>
                                        <button type="button" className="btn btn-primary" onClick={onClickCommentSave}>Save</button>
                                        <div className="commentToolBar-Footer-ImgContainer">                                            
                                            <img src={attachIcon} width={25} onClick={handleAttach}/>
                                            <img src={Card}/>
                                            <img src={Card}/>
                                            <img src={Card}/>
                                          
                                        </div>
                                    </div>    
                                )
                            }
                          
                        </div>
            
                    </div>

                    {
                        detailCardData?.comments?.map((one : Comment, index: number)=>{
                            return (
                                <div key={`key_${index}`} className="comment">
                                    <div className="profile">
                                        <span>TE</span>
                                    </div>
                                    <div 
                                        className="commentText" 
                                    >
                                        <div style={{fontSize:'0.9rem'}}><strong>Test2332</strong> added this card to info</div>
                                        <div style={{margin:' 5px 0'}}>{one.body}</div>
                                        <div style={{fontSize:'0.8rem'}}>{one.created_at}</div>
                                    </div>
                                
                                </div>
                            )
                        })
                    }
                    

                </div>
                <div className="rightSide">
                    <h5>ADD TO CARD</h5>
                    
                    <button type="button" className="btn btn-primary btn-img-row"><img src={Card}/>Members</button>
                    <button type="button" className="btn btn-primary btn-img-row"><img src={ListImg}/>Labels</button>
                    <button type="button" className="btn btn-primary btn-img-row"><img src={Card}/>Checklist</button>
                    <button type="button" className="btn btn-primary btn-img-row"><img src={ListImg}/>Due Date</button>
                    <button type="button" className="btn btn-primary btn-img-row"><img src={Card}/>Attachment</button>
                    <button type="button" className="btn btn-primary btn-img-row"><img src={ListImg}/>Cover</button>

                    <h5>ACTIONS</h5>
                    <button type="button" className="btn btn-primary btn-img-row"><img src={Card}/>Move</button>
                    <button type="button" className="btn btn-primary btn-img-row"><img src={ListImg}/>Copy</button>
                    <button type="button" className="btn btn-primary btn-img-row"><img src={Card}/>Make Template</button>
                    <button type="button" className="btn btn-primary btn-img-row"><img src={ListImg}/>Watch</button>
                    <button type="button" className="btn btn-primary btn-img-row"><img src={Card}/>Archive</button>
                    <button type="button" className="btn btn-primary btn-img-row"><img src={ListImg}/>Share</button>
                </div>
                
            
            </div>
            <input 
                id="attachFilePicker" 
                type="file" 
                className="d-none"
                onChange={onFileChange}
            />
        </animated.div>
        <AttachDetailModal/>
    </animated.div>
  );
}

