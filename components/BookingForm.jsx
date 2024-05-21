import React, { useState } from "react";
import { useRouter } from "next/router";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useBooking } from "../context/BookingContext";

const BookingForm = () => {
  const { selectedDates, selectedRoom } = useBooking();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingData = {
      firstName,
      lastName,
      email,
      startDate: selectedDates[0].toISOString(),
      endDate: selectedDates[1].toISOString(),
      roomId: selectedRoom.id,
      paymentStatus: "pending",
    };

    console.log("Submitting booking data:", bookingData);

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
        console.log("Booking saved successfully:", result);
        router.push(`/payment?bookingId=${result.bookingId}`);
      } else {
        const errorText = await response.text();
        console.error("Failed to save booking:", errorText);
      }
    } catch (error) {
      console.error("Error during booking submission:", error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
        <button type="submit">Next</button>
      </form>
    </LocalizationProvider>
  );
};

export default BookingForm;
