import React, { useState } from 'react';
import InputField from './InputField';

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
    <InputField
      label="Number of Pages:"
      value={pages}
      onChange={setPages}
      min={1}
    />
    <InputField
      label="Number of Days:"
      value={days}
      onChange={setDays}
      min={1}
    />
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
