import React from "react";
import { animated, useSpring } from "react-spring";
import { 
	useSelector, 
	useDispatch 
} from "react-redux";
import reduxAction from "../../../../redux/reduxAction";
import { 
	AppState
   } from "../../../../redux/stores/renderer";

import "./BoardMenu.scss";

import {Boards, BoardSearch} from "../index"


export default function BoardMenu() {
	const dispatch = useDispatch()
	
	const isShowBoardMenu = useSelector((state: AppState) => state.trello.isShowBoardMenu);
		
	
	const expand = useSpring({
		from: { left: isShowBoardMenu ? "-400px" : "0px"},
		
		to:{left: isShowBoardMenu ? "0px" : "-400px"},
		onRest:() =>{
			// if(!isOpen){
			// 	reduxAction(dispatch, {
			// 		type: "SET_SHOW_BOARDMENU",
			// 		arg: false,
			// 	});
			// }
		}
	});

	const handleClick = () => {
		// setisOpen(false)
  	 
		reduxAction(dispatch, {
			type: "SET_SHOW_BOARDMENU",
			arg: false,
		});

	};
  
	const onCreateClick = ()=>{
		reduxAction(dispatch, {
			type: "SET_SHOW_ADD_BOARD_MODAL",
			arg: true,
		});
		reduxAction(dispatch, {
			type: "SET_SHOW_BOARDMENU",
			arg: false,
		});

	}

  	return (
		<animated.div className="BoardMenu" style={{...expand, overflow:'hidden'}}>
			<BoardSearch onClose={handleClick}/>
		
			<Boards />

			<div className="board_buttons">
				<button type="button" className="linkButton" onClick={onCreateClick}>Create New Board...</button>				
			</div>			
		</animated.div>
	);
}

