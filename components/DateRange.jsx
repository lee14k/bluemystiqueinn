import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const DateRange = ({ onSubmit }) => {
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
        <DatePicker/>
        </LocalizationProvider>
    );
    }

export default DateRange;