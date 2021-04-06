import React from "react";

// import { Link } from 'react-router';

import { 
	HeaderSearch,
	HeaderBoard,
	HeaderUser
} from "../index";

import "./Header.scss";

export default function Header() {

  	return (
		<div className="Header">
			<HeaderBoard />
			<HeaderSearch />
			<span className="Header-Logo" />
			<HeaderUser fullName="Tester" />
		</div>
	);
}
