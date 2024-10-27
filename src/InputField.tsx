import React from 'react';

interface InputFieldProps {
  label: string;
  value: number | '';
  onChange: (value: number | '') => void;
  min?: number;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, min }) => {
  return (
    <div>
      <label>
        {label}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : '')}
          min={min}
        />
      </label>
    </div>
  );
};

export default InputField;
