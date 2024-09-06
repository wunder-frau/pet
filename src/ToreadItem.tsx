import React from 'react'
import { Toread } from './types'

interface ToreadItemProps {
	toread: Toread;
	toggleToread: (id: number) => void;
	deleteToread: (id: number) => void;
}

const ToreadItem: React.FC<ToreadItemProps> = ({ toread, toggleToread, deleteToread }) => {
	return (
		<li>
			<label style={{ textDecoration: toread.completed ? 'line-through' : 'none' }}>
				<input
					type="checkbox"
					checked={toread.completed}
					onChange={() => toggleToread(toread.id)}
					/>
				{toread.text}
			</label> 
			{toread.imageUrl && (
				<div>
					<img 
						src={toread.imageUrl}
						alt={toread.text}
						style={{
							width: '300px',
							height: '400px',
							objectFit: 'cover',
							display: 'block',
						}} 
					/>
				</div>
				)}
			<button onClick={() => deleteToread(toread.id)}>Delete</button>
		</li>
	);
};

export default ToreadItem;