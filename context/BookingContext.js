import React, { createContext, useContext, useState, useEffect } from 'react';
import dayjs from 'dayjs';

// Create the context
const BookingContext = createContext();

// Provider component
export const BookingProvider = ({ children }) => {
  const [selectedDates, setSelectedDates] = useState([null, null]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [paymentId, setPaymentId] = useState(null);

  // Load data from local storage on mount
  useEffect(() => {
    const storedDates = JSON.parse(localStorage.getItem('selectedDates'));
    const storedRoom = JSON.parse(localStorage.getItem('selectedRoom'));
    if (storedDates) {
      const parsedDates = [dayjs(storedDates[0]), dayjs(storedDates[1])];
      setSelectedDates(parsedDates);
    }
    if (storedRoom) {
      setSelectedRoom(storedRoom);
    }
  }, []);

  // Save data to local storage when it changes
  useEffect(() => {
    if (selectedDates[0] && selectedDates[1]) {
      localStorage.setItem('selectedDates', JSON.stringify(selectedDates));
    }
  }, [selectedDates]);

  useEffect(() => {
    if (selectedRoom) {
      localStorage.setItem('selectedRoom', JSON.stringify(selectedRoom));
    }
  }, [selectedRoom]);

  // Function to clear the booking context and local storage
  const clearBooking = () => {
    setSelectedDates([null, null]);
    setSelectedRoom(null);
    setPaymentId(null);
    localStorage.removeItem('selectedDates');
    localStorage.removeItem('selectedRoom');
    localStorage.removeItem('paymentId');
  };

  return (
      <BookingContext.Provider value={{ selectedDates, setSelectedDates, selectedRoom, setSelectedRoom, paymentId, setPaymentId, clearBooking }}>
        {children}
      </BookingContext.Provider>
  );
};

// Hook to use the BookingContext
export const useBooking = () => useContext(BookingContext);
