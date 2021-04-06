import React from "react";

// import { Link } from 'react-router';

// import { 
// 	HeaderSearch,
// 	HeaderBoard,
// 	HeaderUser
// } from "../index";
import { 	
	useDispatch, useSelector 
} from "react-redux";
import reduxAction from "../../../../redux/reduxAction";

import "./Subheader.scss";
import  StarIcon from "../../../../../assets/images/trello/star.png";

import ProfileIcon from "../../../../../assets/images/trello/headerUserImg.png"
import { 
	InviteModal,
	CloseModals,
	SubAccModal,
	SubMoreMenu
} from "../index"
import { 
	AppState
  } from "../../../../redux/stores/renderer";


export default function Subheader() {
	const dispatch = useDispatch()
	
	const showInviteModal = useSelector((state: AppState) => state.trello.showInviteModal);
	const showSubAccModal = useSelector((state: AppState) => state.trello.showSubAccModal);
	const boardData = useSelector((state: AppState) => state.trello.boardData);
	const showSubHeaderMoreMenu = useSelector((state: AppState) => state.trello.showSubHeaderMoreMenu);
	
	const handleInvite = ()=>{
		CloseModals(dispatch, "SET_SHOW_INVITE_MODAL")
    	reduxAction(dispatch, {
			type: "SET_SHOW_INVITE_MODAL",
			arg: !showInviteModal,
		});
	}
	const handleSubProfile = ()=>{
		CloseModals(dispatch, "SET_SHOW_SUB_ACC_MODAL")
    	reduxAction(dispatch, {
			type: "SET_SHOW_SUB_ACC_MODAL",
			arg: !showSubAccModal,
		});

	}

	const handleHome = ()=>{
		reduxAction(dispatch, {
			type: "SET_BOARD_DATA",
			arg: null,
		});
	}
	const handleShowMore = ()=>{
		CloseModals(dispatch, "SET_SHOW_SUB_MORE_MENU")
    	reduxAction(dispatch, {
			type: "SET_SHOW_SUB_MORE_MENU",
			arg: !showSubHeaderMoreMenu,
		});

		// reduxAction(dispatch, {
		// 	type: "SET_SHOW_SUB_MORE_MENU",
		// 	arg: !showSubHeaderMoreMenu
		// })
	}
  	return (
		<div className="subHeader">
			<div className="leftSide">
				<div className="subHeaderTitle">				
					<span>{boardData?.title}</span>				
				</div>
				<div className="starButton">
					<img src={StarIcon} width="18px" />
				</div>
				<div className="vl"/>
				
				<div className="subHeaderButton" onClick={()=>handleHome()}>
					<span>Home</span>
				</div>

				<div className="vl"/>
				
				<div className="subHeaderButton" onClick={()=>handleInvite()}>
					<span>Invite</span>
				</div>

				<div className="vl"/>
				<div className="subProfile" onClick={()=>handleSubProfile()}>
					<img src={ProfileIcon} width="30px" />
				</div>
			</div>
			<div className="rightSide">
			<div className="subHeaderButton" onClick={()=>handleShowMore()}>
					<span>... Show menu</span>
				</div>
			</div>

					
			<InviteModal />
			<SubAccModal />
			<SubMoreMenu/>
		</div>
	);
}
