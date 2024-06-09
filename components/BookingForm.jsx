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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [secondGuest, setSecondGuest] = useState(false);
  const [secondFirstName, setSecondFirstName] = useState("");
  const [secondLastName, setSecondLastName] = useState("");
  const [secondEmail, setSecondEmail] = useState("");
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
      secondGuest: secondGuest ? {
        firstName: secondFirstName,
        lastName: secondLastName,
        email: secondEmail,
      } : null,
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
    <div  className="flex flex-col justify-center items-center w-full">
      <h1 className="text-4xl my-12">Complete your booking details</h1>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box mb={2} className="flex justify-center items-center">
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
        <form onSubmit={handleSubmit} className="flex flex-col  p-6 bg-white shadow-md rounded-lg w-full">
  <h1 className="text-2xl font-bold mb-4 flex justify-center items-center">Contact Information</h1>
  
  <input
    type="text"
    placeholder="First Name"
    value={firstName}
    onChange={(e) => setFirstName(e.target.value)}
    className="mb-4 p-2 border border-gray-300 rounded"
  />
  <input
    type="text"
    placeholder="Last Name"
    value={lastName}
    onChange={(e) => setLastName(e.target.value)}
    className="mb-4 p-2 border border-gray-300 rounded"
  />
  <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="mb-4 p-2 border border-gray-300 rounded"
  />
  <input
    type="text"
    placeholder="Phone Number"
    value={phoneNumber}
    onChange={(e) => setPhoneNumber(e.target.value)}
    className="mb-4 p-2 border border-gray-300 rounded"
  />

  <h1 className="text-2xl font-bold mb-4 flex justify-center items-center">Address Information</h1>
  
  <input
    type="text"
    placeholder="Country"
    value={country}
    onChange={(e) => setCountry(e.target.value)}
    className="mb-4 p-2 border border-gray-300 rounded"
  />
  <input
    type="text"
    placeholder="State"
    value={state}
    onChange={(e) => setState(e.target.value)}
    className="mb-4 p-2 border border-gray-300 rounded"
  />
  <input
    type="text"
    placeholder="City"
    value={city}
    onChange={(e) => setCity(e.target.value)}
    className="mb-4 p-2 border border-gray-300 rounded"
  />
  <input
    type="text"
    placeholder="Street Address"
    value={streetAddress}
    onChange={(e) => setStreetAddress(e.target.value)}
    className="mb-4 p-2 border border-gray-300 rounded"
  />
  <input
    type="text"
    placeholder="Zip Code"
    value={zipCode}
    onChange={(e) => setZipCode(e.target.value)}
    className="mb-4 p-2 border border-gray-300 rounded"
  />

  <div className="mb-4">
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={secondGuest}
        onChange={(e) => setSecondGuest(e.target.checked)}
        className="form-checkbox"
      />
      <span>Will a second guest be coming?</span>
    </label>
  </div>

  {secondGuest && (
    <div className="flex flex-col mb-4">
      <input
        type="text"
        placeholder="Second Guest First Name"
        value={secondFirstName}
        onChange={(e) => setSecondFirstName(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        placeholder="Second Guest Last Name"
        value={secondLastName}
        onChange={(e) => setSecondLastName(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <input
        type="email"
        placeholder="Second Guest Email"
        value={secondEmail}
        onChange={(e) => setSecondEmail(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
    </div>
  )}

  <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 w-1/3">
    Next
  </button>
</form>

    </LocalizationProvider>
    </div>
  );
};

export default BookingForm;
