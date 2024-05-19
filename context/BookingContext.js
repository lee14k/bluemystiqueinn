import React, { createContext, useContext, useState, useEffect } from 'react';
import dayjs from 'dayjs';

// Create the context
const BookingContext = createContext();

// Provider component
export const BookingProvider = ({ children }) => {
  const [selectedDates, setSelectedDates] = useState([null, null]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Load data from local storage on mount
  useEffect(() => {
    const storedDates = JSON.parse(localStorage.getItem('selectedDates'));
    const storedRoom = JSON.parse(localStorage.getItem('selectedRoom'));
    if (storedDates) {
      setSelectedDates([dayjs(storedDates[0]), dayjs(storedDates[1])]);
    }
    if (storedRoom) {
      setSelectedRoom(storedRoom);
    }
  }, []);

  // Save data to local storage when it changes
  useEffect(() => {
    localStorage.setItem('selectedDates', JSON.stringify(selectedDates));
  }, [selectedDates]);

  useEffect(() => {
    localStorage.setItem('selectedRoom', JSON.stringify(selectedRoom));
  }, [selectedRoom]);

  return (
    <BookingContext.Provider value={{ selectedDates, setSelectedDates, selectedRoom, setSelectedRoom }}>
      {children}
    </BookingContext.Provider>
  );
};

// Hook to use the BookingContext
export const useBooking = () => useContext(BookingContext);
