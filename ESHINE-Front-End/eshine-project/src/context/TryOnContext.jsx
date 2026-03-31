import React, { createContext, useContext, useState } from 'react';

const TryOnContext = createContext();

export const useTryOn = () => {
  return useContext(TryOnContext);
};

export const TryOnProvider = ({ children }) => {
  const [selectedGarments, setSelectedGarments] = useState([]);

  const addGarment = (garment) => {
    setSelectedGarments((prev) => {
      // Avoid duplicates
      if (prev.find(item => item.id === garment.id)) {
        return prev;
      }
      // Maximum 2 garments (e.g. top and bottom) for this demo
      if (prev.length >= 2) {
        return [prev[1], garment]; 
      }
      return [...prev, garment];
    });
  };

  const removeGarment = (garmentId) => {
    setSelectedGarments((prev) => prev.filter(item => item.id !== garmentId));
  };
  
  const clearGarments = () => {
    setSelectedGarments([]);
  }

  return (
    <TryOnContext.Provider value={{ selectedGarments, addGarment, removeGarment, clearGarments }}>
      {children}
    </TryOnContext.Provider>
  );
};
