import React, { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

const BookingForm = ({ onSubmit, selectedDates }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [time, setTime] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);

  useEffect(() => {
    setDateRange(selectedDates);
  }, [selectedDates]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name,
      email,
      startDate: dateRange[0],
      endDate: dateRange[1],
      time,
    });
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
        <button type="submit">Book</button>
      </form>
    </LocalizationProvider>
  );
};

export default BookingForm;
