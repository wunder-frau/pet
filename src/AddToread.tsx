import React, { useState } from 'react';

interface AddToreadProps {
addToread: (text: string, imageUrl?: string) => void;
}

const AddToread: React.FC<AddToreadProps> = ({ addToread }) => {
const [text, setText] = useState('');
const [imageUrl, setImageUrl] = useState('');

const handleSubmit = (e: React.FormEvent) => {
	e.preventDefault();
	if (text.trim()) {
		addToread(text,  imageUrl);
		setText('');
		setImageUrl('');
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
			<input
				type="text"
				value={imageUrl}
				onChange={(e) => setImageUrl(e.target.value)}
				placeholder="Image URL (optional)"
			/>
			<button type="submit">Add</button>
		</form>
	);
};

export default AddToread;