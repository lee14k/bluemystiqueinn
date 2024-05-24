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
    const storedPaymentId = localStorage.getItem('paymentId');
    console.log('Loaded from localStorage:', { storedDates, storedRoom, storedPaymentId }); // Debug log

    if (storedDates) {
      const parsedDates = [dayjs(storedDates[0]), dayjs(storedDates[1])];
      if (parsedDates[0].isValid() && parsedDates[1].isValid()) {
        setSelectedDates(parsedDates);
      } else {
        console.error('Invalid dates loaded from localStorage:', parsedDates);
      }
    }
    if (storedRoom) {
      setSelectedRoom(storedRoom);
    }
    if (storedPaymentId) {
      setPaymentId(storedPaymentId);
    }
  }, []);

  // Save data to local storage when it changes
  useEffect(() => {
    if (selectedDates[0] && selectedDates[1] && selectedDates[0].isValid() && selectedDates[1].isValid()) {
      localStorage.setItem('selectedDates', JSON.stringify([selectedDates[0].toISOString(), selectedDates[1].toISOString()]));
      console.log('Saved to localStorage:', { selectedDates }); // Debug log
    }
  }, [selectedDates]);

  useEffect(() => {
    if (selectedRoom) {
      localStorage.setItem('selectedRoom', JSON.stringify(selectedRoom));
      console.log('Saved to localStorage:', { selectedRoom }); // Debug log
    }
  }, [selectedRoom]);

  useEffect(() => {
    if (paymentId) {
      localStorage.setItem('paymentId', paymentId);
      console.log('Saved to localStorage:', { paymentId }); // Debug log
    }
  }, [paymentId]);

  return (
    <BookingContext.Provider value={{ selectedDates, setSelectedDates, selectedRoom, setSelectedRoom, paymentId, setPaymentId }}>
      {children}
    </BookingContext.Provider>
  );
};

// Hook to use the BookingContext
export const useBooking = () => useContext(BookingContext);
