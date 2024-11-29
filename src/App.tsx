import React, { useState, useEffect } from 'react';
import './App.css';
import { Toread } from './types';
import ToreadList from './ToreadList';
import AddToread from './AddToread';
import Bookshelf from './Bookshelf';
import ReadingEstimator from './ReadingEstimator';
import ThreeBookshelf from './ThreeBookshelf';

const App: React.FC = () => {
	const [count, setCount] = useState(0);
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

	const [isEstimatorVisible, setEstimatorVisible] = useState(false);

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Escape") {
			setEstimatorVisible(false);
		}
	};

	useEffect(() => {
		if (isEstimatorVisible) {
			document.addEventListener("keydown", handleKeyDown);
		} else {
			document.removeEventListener("keydown", handleKeyDown);
		}
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isEstimatorVisible]);

	useEffect(() => {
		localStorage.setItem('toreads', JSON.stringify(toreads));
	}, [toreads]);

	const addToread = (text: string, imageUrl?: string) => {
		const newToread: Toread = {
			id: Date.now(),
			text,
			completed: false,
			imageUrl,
		};
		console.log("New Toread Item: ", newToread); 
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
		<>
			<div className="bookshelf">
				<ThreeBookshelf books={toreads} />
			</div>
			<Bookshelf books={toreads} />
			{isEstimatorVisible && (
				<div className="modal">
					<div className="modal-content">
						<button className="close-button" onClick={() => setEstimatorVisible(false)}>
							&times;
						</button>
						<ReadingEstimator />
					</div>
				</div>
			)}
			<div className="App">
				<h1>
					{title.split('').map((letter, index) => (
						<span key={index} style={{ '--index': index } as React.CSSProperties}>
							{letter}
						</span>
					))}
				</h1>
				<button onClick={() => setEstimatorVisible(true)} className="open-estimator-button">
				Open Reading Estimator
				</button>
				<AddToread addToread={addToread} />
				<ToreadList toreads={toreads} toggleToread={toggleToread} deleteToread={deleteToread} />
				<p className="completed-count">completed: {completedCount}</p>
				<p>
					<button onClick={() => setCount(count => count + 1)}>
						count is {count}
					</button>
				</p>
			</div>
		</>
	);
};

export default App;