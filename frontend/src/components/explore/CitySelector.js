import React, { useState } from 'react';
import { FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

/**
 * CitySelector Component
 * 
 * Displays the current city with an option to change it
 * Following Single Responsibility Principle - only handles city selection
 */
const CitySelector = ({ currentCity, onCityChange }) => {
  const [showCityModal, setShowCityModal] = useState(false);
  
  // Available cities - limited to Gurugram and Agra as requested
  const cities = [
    { id: 'gurugram', name: 'Gurugram', icon: <FaMapMarkerAlt className="text-white" /> },
    { id: 'agra', name: 'Agra', icon: <FaMapMarkerAlt className="text-white" /> }
  ];
  
  const handleCitySelect = (city) => {
    onCityChange(city);
    setShowCityModal(false);
  };
  
  return (
    <div className="relative">
      {/* Current City Display */}
      <div 
        className="flex items-center cursor-pointer py-2 text-white"
        onClick={() => setShowCityModal(!showCityModal)}
      >
        <FaMapMarkerAlt className="text-white mr-2" />
        <span className="text-base font-medium mr-2">{currentCity || 'Select City'}</span>
        <FaChevronDown className="text-white" />
      </div>
      
      {/* City Selection Modal */}
      {showCityModal && (
        <div className="absolute top-full left-0 mt-2 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg z-50 border border-gray-200">
          <div className="p-3 border-b border-gray-200 bg-gray-50 bg-opacity-80">
            <h3 className="text-base font-medium text-center">Select City</h3>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {cities.map(city => (
              <div 
                key={city.id}
                className="flex items-center p-4 hover:bg-gray-100 hover:bg-opacity-70 cursor-pointer transition-colors duration-200"
                onClick={() => handleCitySelect(city.name)}
              >
                {city.icon}
                <span className="ml-2 text-base">{city.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CitySelector;
