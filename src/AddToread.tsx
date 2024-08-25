import React, { useState } from 'react';

interface AddToreadProps {
addToread: (text: string) => void;
}

const AddToread: React.FC<AddToreadProps> = ({ addToread }) => {
const [text, setText] = useState('');

const handleSubmit = (e: React.FormEvent) => {
	e.preventDefault();
	if (text.trim()) {
		addToread(text);
		setText('');
	}
};

return (
	<form onSubmit={handleSubmit}>
		<input
			type="text"
			value={text}
			onChange={(e) => setText(e.target.value)}
			placeholder="Add a new book title"
		/>
		<button type="submit">Add</button>
	</form>
);
};

export default AddToread;