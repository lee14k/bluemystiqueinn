import React, { useState, useEffect } from 'react';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import RoomCard from '../components/RoomCard';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useBooking } from '../context/BookingContext';

const SelectRoom = () => {
  const { selectedDates, setSelectedDates, selectedRoom, setSelectedRoom } = useBooking();
  const [dateRange, setDateRange] = useState(selectedDates);
  const [rooms, setRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchRooms();
    fetchBookingData();
  }, []);

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      filterAvailableRooms();
    }
  }, [dateRange, rooms, bookingData]);

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms');
      const roomsData = await response.json();
      if (response.ok) {
        setRooms(roomsData);
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
    const availableRoomsStatus = rooms.map(room => {
      const isBooked = bookingData.some(booking => {
        if (booking.room_id === room.id) {
          const bookedStart = dayjs(booking.start_date);
          const bookedEnd = dayjs(booking.end_date).add(1, 'day');
          return (
            dateRange[0].isBefore(bookedEnd) && dateRange[1].isAfter(bookedStart)
          );
        }
        return false;
      });

      return { ...room, availability: isBooked ? "Unavailable" : "Available" };
    });

    setAvailableRooms(availableRoomsStatus);
  };

  const handleProceed = () => {
    setSelectedDates(dateRange);
    router.push('/complete-your-booking');
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
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
            availability={room.availability}
            roomName={room.room_name}
            occupancy={room.occupancy}
            rate={room.rate}
            onSelect={() => handleRoomSelect(room)}
            selected={selectedRoom?.id === room.id}
          />
        ))}
      </div>
      <button className="bg-gray-900 text-white py-2.5" onClick={handleProceed} disabled={!selectedRoom}>
        Proceed to Booking
      </button>
    </div>
  );
}

export default SelectRoom;
