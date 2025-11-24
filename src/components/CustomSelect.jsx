import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

function CustomSelect({ label, value, onChange, options, name }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    // Mimic the event object structure expected by handleInputChange
    onChange({ target: { name, value: option } });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-bold text-white uppercase mb-2">{label}</label>
      <div 
        className="w-full bg-transparent border border-gray-500 rounded px-3 py-2 text-white cursor-pointer flex justify-between items-center hover:border-white transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{value}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-black border border-gray-500 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className={`px-3 py-2 hover:bg-gray-800 cursor-pointer text-white text-sm ${value === option ? 'bg-gray-900 font-bold' : ''}`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

CustomSelect.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
};

export default CustomSelect;
