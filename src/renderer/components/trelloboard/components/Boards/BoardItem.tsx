import React, {
	// useState,
	// ChangeEvent
} from "react";
import { 
	// animated, 
	// useSpring 
} from "react-spring";
import { useDispatch } from 'react-redux';
import reduxAction from "../../../../redux/reduxAction";

import Sonic from "../../../../../assets/images/sonic.png"
import "./Boards.scss";
import { 
	
	BoardData
  } from '../types/types';
  
import { getAllBoard, getAllCardsById, getAllPublicBoards } from '../../../../api/trello/apis';

export type BoardItemProps = {
	board : BoardData
}



export default function BoardItem({board} : BoardItemProps ) {
	const dispatch = useDispatch()


	// const expand = useSpring({
	// 	from: { left: "-400px" },
	// 	// onRest: updateOverflow,
	// 	to:{left: "0px"}
	//   });

	// const handleClick = () => {
	 
	// };

	const onClick=()=>{

		reduxAction(dispatch, {
			type: "SET_BOARD_DATA",
			arg: board
		})

		reduxAction(dispatch, {
			type: "SET_SHOW_BOARDMENU",
			arg: false,
		});	

		setTimeout(async() => {
			await getAllCardsById(board._id)
		  }, 100);

	}

	return (
			
			<div className="boardRow" style={{marginLeft: 30, marginRight: 20, marginTop:5}} onClick={onClick}>
				{/* <div className="borderImage">
					<img src={Sonic} />
				</div> */}
				<div className="borderBody">
					<h5>{board.title} </h5>
				</div>
			</div>
		
	);
}
