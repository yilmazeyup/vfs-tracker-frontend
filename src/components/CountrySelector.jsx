import React from 'react';

const CountrySelector = ({ selectedCountry, onCountrySelect, countries }) => {
  return (
    <div className="control-group">
      <label>Ülke Seçimi</label>
      <select
        value={selectedCountry}
        onChange={(e) => onCountrySelect(e.target.value)}
        className="form-select"
      >
        {Object.entries(countries).map(([key, country]) => (
          <option key={key} value={key}>
            {country.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CountrySelector;