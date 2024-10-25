import React from 'react';
import { Toread } from './types';

interface BookshelfProps {
  books: Toread[];
}

const Bookshelf: React.FC<BookshelfProps> = ({ books }) => {
	return (
		<div className="bookshelf">
			<div className="shelf">
				{books.map((book, index) => (
					<div key={index} className={`book ${book.completed ? 'completed' : ''}`}>
						<span className="book-title">{book.text}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default Bookshelf;
