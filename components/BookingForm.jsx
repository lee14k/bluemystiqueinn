import React, { useState } from "react";
import { useRouter } from "next/router";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useBooking } from "../context/BookingContext";

const BookingForm = () => {
  const { selectedDates, selectedRoom } = useBooking();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingData = {
      name,
      email,
      startDate: selectedDates[0].toISOString(),
      endDate: selectedDates[1].toISOString(),
      roomId: selectedRoom.id,
      paymentStatus: "pending",
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/payment?bookingId=${result.bookingId}`);
      } else {
        console.error("Failed to save booking:", await response.text());
      }
    } catch (error) {
      console.error("Error during booking submission:", error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit}>
       
        <Box mb={2}>
          <TextField
            label="Start Date"
            value={selectedDates[0] ? selectedDates[0].format("YYYY-MM-DD") : ""}
            InputProps={{ readOnly: true }}
          />
          <Box sx={{ mx: 2 }}>to</Box>
          <TextField
            label="End Date"
            value={selectedDates[1] ? selectedDates[1].format("YYYY-MM-DD") : ""}
            InputProps={{ readOnly: true }}
          />
        </Box>
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
        <button type="submit">Next</button>
      </form>
    </LocalizationProvider>
  );
};

export default BookingForm;
