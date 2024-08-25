import React from "react";
import { Toread } from './types'
import ToreadItem from './ToreadItem'

interface ToreadListProps {
	toreads: Toread[];
	toggleToread: (id: number) => void;
	deleteToread: (id: number) => void;
}

const ToreadList: React.FC<ToreadListProps> = ({ toreads, toggleToread, deleteToread }) => {
	return (
		<ul>
			{toreads.map(toread => (
				<ToreadItem key={toread.id} toread={toread} toggleToread={toggleToread} deleteToread={deleteToread} />
			))}
		</ul>
	);
};

export default ToreadList;