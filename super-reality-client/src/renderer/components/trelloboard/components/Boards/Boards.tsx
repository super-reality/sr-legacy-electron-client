import React, {
	// useState,
	// ChangeEvent
} from "react";
import { useSelector } from "react-redux";
import { 
	animated, 
	// useSpring 
} from "react-spring";

import "./Boards.scss";
import BoardItem from "./BoardItem";
import logo from "../../../../../assets/images/trello/trello-logo.png"

import { 
	AppState
} from "../../../../redux/stores/renderer";

export default function Boards() {
	
	const personalBoards = useSelector((state : AppState)=>state.trello.personalBoards)
	const recentBoards = useSelector((state : AppState)=>state.trello.recentBoards)

	return (
		<animated.div className="boardContainer" style={{overflowY:'auto'}}>
			<div className="boardTitle">
				<img src={logo}/>
				recent boards
			</div>
			{
				recentBoards?.map(one=><BoardItem board={one}/>)
			}
			
			<div className="boardTitle">
				<img src={logo}/>
				personal boards
			</div>
			{
				personalBoards?.map(one=><BoardItem board={one}/>)
			}
			
			
		</animated.div>
	);
}
