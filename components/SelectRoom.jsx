import React, { useState, useEffect } from "react";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import RoomCard from "./RoomCard";
import dayjs from "dayjs";

const SelectRoom = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [rooms, setRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [bookingData, setBookingData] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      filterAvailableRooms();
    }
  }, [dateRange, bookingData]);

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms'); // Adjust the endpoint to your actual rooms API
      const roomsData = await response.json();
      if (response.ok) {
        setRooms(roomsData);
        fetchBookingData(); // Fetch booking data after rooms are fetched
      } else {
        console.error('Error fetching rooms:', roomsData.error);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchBookingData = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      if (response.ok) {
        setBookingData(data);
      } else {
        console.error('Error fetching bookings:', data.error);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const filterAvailableRooms = () => {
    const available = rooms.filter(room => {
      const isBooked = bookingData.some(booking => {
        if (booking.room_id === room.id) {
          const bookedStart = dayjs(booking.start_date);
          const bookedEnd = dayjs(booking.end_date);
          return (
            dateRange[0].isBetween(bookedStart, bookedEnd, null, '[]') ||
            dateRange[1].isBetween(bookedStart, bookedEnd, null, '[]') ||
            bookedStart.isBetween(dateRange[0], dateRange[1], null, '[]') ||
            bookedEnd.isBetween(dateRange[0], dateRange[1], null, '[]')
          );
        }
        return false;
      });

      return !isBooked;
    });

    setAvailableRooms(available);
  };

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
      </LocalizationProvider>
      <div>
        {availableRooms.map(room => (
          <RoomCard
            key={room.id}
            availability="Available"
            roomName={room.room_name}
            occupancy={room.occupancy}
            rate={room.rate}
          />
        ))}
      </div>
    </div>
  );
}

export default SelectRoom;
