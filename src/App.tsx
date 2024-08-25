import React, { useState, useEffect } from 'react';
import './App.css';
import { Toread } from './types';
import ToreadList from './ToreadList';
import AddToread from './AddToread';

const App: React.FC = () => {
	// const [toreads, setToreads] = useState<Toread[]>([]);

	const [toreads, setToreads] = useState<Toread[]>(() => {
    const storedToreads = localStorage.getItem('toreads');
    if (storedToreads) {
      try {
        return JSON.parse(storedToreads) as Toread[];
      } catch (e) {
        console.error('Failed to parse toreads from local storage:', e);
      }
    }
    return [];
  });

  // Save to-read list to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('toreads', JSON.stringify(toreads));
  }, [toreads]);

	const addToread = (text: string) => {
		const newToread: Toread = {
			id: Date.now(),
			text,
			completed: false,
		};
		setToreads([...toreads, newToread]);
	}
	const toggleToread = (id: number) => {
		setToreads(toreads.map(toread =>
			toread.id === id ? { ...toread, completed: !toread.completed } : toread
		));
	};

	const deleteToread = (id: number) => {
		setToreads(toreads.filter(toread => toread.id !== id));
	};
	const title = 'to_read_app.';
	const completedCount = toreads.filter(toread => toread.completed).length;
	return (
		<div className="App">
			<h1>
				{title.split('').map((letter, index) => (
					<span key={index} style={{ '--index': index } as React.CSSProperties}>
						{letter}
					</span>
				))}
			</h1>
			<p className="checkbox-count">Completed: {completedCount}</p>
			<AddToread addToread={addToread} />
			<ToreadList toreads={toreads} toggleToread={toggleToread} deleteToread={deleteToread} />
		</div>
	);
};

export default App;