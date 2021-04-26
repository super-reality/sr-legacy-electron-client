import React from "react";



import { 
	
	useDispatch, useSelector 
} from "react-redux";
import reduxAction from "../../../../redux/reduxAction";

import "./HeaderUser.scss";

import { 
	CreateModal,
  NotiModal,
  CloseModals,
  InfoModal,
  AccModal
} from "../index"

import PlusIcon from "../../../../../assets/images/trello/plus.png";
import Exclam from "../../../../../assets/images/trello/exclamation.png";
import Alert from "../../../../../assets/images/trello/alert.png";
import { 
	AppState
  } from "../../../../redux/stores/renderer";



type HeaderUserPropTypes = {
  fullName: string
}

export default function HeaderUser({ fullName }: HeaderUserPropTypes) {

  const dispatch = useDispatch()
  const showCreateModal = useSelector((state: AppState) => state.trello.showCreateModal);
  const showNotiModal = useSelector((state: AppState) => state.trello.showNotiModal);
  const showInfoModal = useSelector((state: AppState) => state.trello.showInfoModal);
  const showAccModal = useSelector((state: AppState) => state.trello.showAccModal);


  const handleShowCreateModal=()=>{
    CloseModals(dispatch, "SET_SHOW_CREATE_MODAL")
    reduxAction(dispatch, {
			type: "SET_SHOW_CREATE_MODAL",
			arg: !showCreateModal,
		});
  }

  const handleUserNameClick = ()=>{
    console.log('handle click user')
    CloseModals(dispatch, "SET_SHOW_ACC_MODAL")
    reduxAction(dispatch, {
			type: "SET_SHOW_ACC_MODAL",
			arg: !showAccModal,
		});
  }

  const handleNotiClick = ()=>{
    CloseModals(dispatch, "SET_SHOW_NOTI_MODAL")
    reduxAction(dispatch, {
			type: "SET_SHOW_NOTI_MODAL",
			arg: !showNotiModal,
		});
  }

  const handleShowInfoModal = ()=>{
    CloseModals(dispatch, "SET_SHOW_INFO_MODAL")
    reduxAction(dispatch, {
			type: "SET_SHOW_INFO_MODAL",
			arg: !showInfoModal,
		});
  }

  return (
    <div className="Header-User" style={{marginRight: 80}}>
      
      <div className="Header-Button-Icon Header-User-Add" onClick={()=>{handleShowCreateModal()}}>
        <img src={PlusIcon} width="20px"/>
      </div>
      
      {/* <div className="Header-Button-Icon Header-Button Header-User-Info" onClick={()=>handleShowInfoModal()}>
        <img src={Exclam} width="20px"/>
      </div> */}
           
      {/* <div className="Header-Button-Icon Header-User-Notifications" onClick={()=>handleNotiClick()}>
        <img src={Alert} width="20px"/>
      </div> */}

      {/* <span className="Header-Button Header-User-Menu">
        <span className="Header-User-Name"
          onClick={() => handleUserNameClick()} > {fullName} </span>
      </span> */}

      <CreateModal />	
      <NotiModal />
      <InfoModal />
      <AccModal />
    
    </div>
  );
}

// HeaderUser.propTypes = propTypes;