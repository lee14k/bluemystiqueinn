import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useBooking } from '../context/BookingContext';
import dayjs from 'dayjs';

const BookingForm = () => {
  const { selectedDates, selectedRoom } = useBooking();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (selectedDates[0] && selectedDates[1]) {
      setDateRange(selectedDates);
      console.log("Selected Dates: ", selectedDates);
    }
  }, [selectedDates]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the booking submission logic here
    console.log({
      name,
      email,
      startDate: dateRange[0],
      endDate: dateRange[1],
      room: selectedRoom
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit}>
     
        <Box mb={2}>
          <DateRangePicker
            startText="Start Date"
            endText="End Date"
            value={dateRange}
            onChange={(newRange) => setDateRange(newRange)}
            renderInput={(startProps, endProps) => (
              <>
                <TextField {...startProps} />
                <Box sx={{ mx: 2 }}>to</Box>
                <TextField {...endProps} />
              </>
            )}
          />
        </Box>
        <div>
          <p>Start Date: {dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : 'Not Selected'}</p>
          <p>End Date: {dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : 'Not Selected'}</p>
          <p>Room: {selectedRoom ? selectedRoom.room_name : 'Not Selected'}</p>
          <input
          type="text"
          placeholder="First Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
        type="phone"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
        </div>
        <button type="submit">Book</button>
      </form>
    </LocalizationProvider>
  );
};

export default BookingForm;
