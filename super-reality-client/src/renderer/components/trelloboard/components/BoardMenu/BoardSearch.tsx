import React, { useState , ChangeEvent} from "react";

import CloseIcon from "../../../../../assets/images/trello/close.png"
import "./BoardMenu.scss";


const PropsType = {
	onClose : ()=>{
		console.log('asd')
	}
}



export default function BoardSearch(props : typeof PropsType) {
	
	const [search, setSearch] = useState('')
	const handleChange = (e : ChangeEvent<HTMLInputElement>) =>{
		setSearch(e.target.value);
		
	}

	const handleClick = ()=>{
		props.onClose()
	}

  	return (
		
			<div className="searchContainer">
				<input 
					className="Header-Board-Search-Input" 
					type="text" 
					autoComplete="off" 
					autoCorrect="off" 
					spellCheck="false" 
					value={search}
					placeholder="Find boards by name..."
					onChange={handleChange}        
				/>
				<button type="button" onClick={handleClick}>
					<img src={CloseIcon} />
				</button>				
			</div>
			
	);
}

