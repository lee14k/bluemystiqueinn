import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const BookingForm = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, email, date, time });
    };
    
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>

        <form onSubmit={handleSubmit}>
        <input
            type="text"
            placeholder="Name"
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
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
        />
        <DatePicker/>
        <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
        />
        <button type="submit">Book</button>
        </form>
        </LocalizationProvider>
    );
    }

export default BookingForm;