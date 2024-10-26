import React, { useState } from 'react';

const ReadingEstimator: React.FC = () => {
  const [pages, setPages] = useState<number | ''>('');
  const [days, setDays] = useState<number | ''>('');
  const [pagesPerDay, setPagesPerDay] = useState<number | null>(null);
  
  const calculatePagesPerDay = () => {
    if (pages && days && days > 0) {
      const result = Math.ceil(pages / days);
      setPagesPerDay(result);
    } else {
      setPagesPerDay(null);
    }
  }
  return (
    <div className="reading-estimator">
      <h3>Reading Estimator</h3>
      <div>
        <label>
          Number of pages
          <input
            type="number"
            value={pages}
            onChange={(e) => setPages(e.target.value ? parseInt(e.target.value) : '')}
            min="1"
          />
        </label>
      </div>
      <div>
      <label>
        Number of Days:
        <input
          type="number"
          value={days}
          onChange={(e) => setDays(e.target.value ? parseInt(e.target.value) : '')}
          min="1"
        />
      </label>
    </div>
    <button onClick={calculatePagesPerDay}>Calculate</button>
    {pagesPerDay !== null && (
      <div className="result">
        <p>You need to read <strong>{pagesPerDay}</strong> pages per day to finish your book in the specified time.</p>
      </div>
    )}
    </div>
  );
};

export default ReadingEstimator;
