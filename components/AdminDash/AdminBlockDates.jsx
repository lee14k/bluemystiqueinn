import React, { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import dayjs from "dayjs";

const AdminBlockDates = () => {
  const [roomId, setRoomId] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [message, setMessage] = useState("");
  const [memo, setMemo] = useState("");

  const handleBlockDates = async () => {
    if (!roomId || !startDate || !endDate) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("/api/block-dates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room_id: roomId,
          start_date: dayjs(startDate).format("YYYY-MM-DD"),
          end_date: dayjs(endDate).format("YYYY-MM-DD"),
        }),
      });

      if (response.ok) {
        setMessage("Dates blocked successfully!");
      } else {
        const data = await response.json();
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error blocking dates:", error);
      setMessage("Error blocking dates");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '300px', margin: 'auto' }}>
        <TextField
          label="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          fullWidth
        />
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
        <TextField
          label="Memo"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          fullWidth/>
        <Button variant="contained" color="primary" onClick={handleBlockDates}>
          Block Dates
        </Button>
        {message && <Box mt={2} color="error.main">{message}</Box>}
      </Box>
    </LocalizationProvider>
  );
};

export default AdminBlockDates;
