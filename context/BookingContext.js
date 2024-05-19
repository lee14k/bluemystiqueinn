import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [selectedDates, setSelectedDates] = useState([null, null]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  return (
    <BookingContext.Provider value={{ selectedDates, setSelectedDates, selectedRoom, setSelectedRoom }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
