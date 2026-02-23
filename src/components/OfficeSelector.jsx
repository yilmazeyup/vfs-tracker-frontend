import React from 'react';

const OfficeSelector = ({ selectedOffices, onOfficeToggle, offices }) => {
  return (
    <div className="office-checkboxes">
      {offices.map(office => (
        <label key={office} className="checkbox-label">
          <input
            type="checkbox"
            checked={selectedOffices.includes(office)}
            onChange={() => onOfficeToggle(office)}
          />
          <span>{office}</span>
        </label>
      ))}
    </div>
  );
};

export default OfficeSelector;