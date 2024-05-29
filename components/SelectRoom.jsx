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
  //destructuring values from booking context
  const [dateRange, setDateRange] = useState([dayjs(selectedDates[0]), dayjs(selectedDates[1])]);
  const [rooms, setRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchRooms();
    fetchBookingData();
  }, []);
  //this fetches rooms and booking data when the component mounts

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      filterAvailableRooms();
    }
  }, [dateRange, rooms, bookingData, selectedDates]);
//recalculate available rooms when date range, rooms, or booking data changes
//second argument is dependency array, controls when this should run. this is saying to run if the date range, rooms, booking data, or selected dates change
  useEffect(() => {
    if (selectedDates[0] && selectedDates[1]) {
      setDateRange([dayjs(selectedDates[0]), dayjs(selectedDates[1])]);
    }
  }, [selectedDates]);



  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/get-rooms');
      const roomsData = await response.json();
      if (response.ok) {
        console.log('Rooms data:', JSON.stringify(roomsData, null, 2));
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
      const response = await fetch('/api/get-bookings');
      const data = await response.json();
      if (response.ok) {
        console.log('Fetched booking data:', data);
        const completedBookings = data.filter(booking => booking.payment_status === 'completed');
        setBookingData(completedBookings);
      } else {
        console.error('Error fetching bookings:', data.error);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const filterAvailableRooms = () => {
    console.log('Filtering available rooms');
    console.log('Selected date range:', dateRange);
    console.log('Booking data:', bookingData);

    const newAvailableRooms = rooms.map(room => {
      const isBooked = bookingData.some(booking => {
        if (booking.room_name === room.id) {
          const bookedStart = dayjs(booking.start_date);
          const bookedEnd = dayjs(booking.end_date);
          const selectedStart = dayjs(dateRange[0]).startOf('day');
          const selectedEnd = dayjs(dateRange[1]).startOf('day');
          console.log(`Checking room ${room.id} between ${selectedStart.format()} and ${selectedEnd.format()}`);
          console.log(`Booking from ${bookedStart.format()} to ${bookedEnd.format()}`);

          const isUnavailable = (
            (selectedStart.isBetween(bookedStart, bookedEnd, null, '[)') || selectedEnd.isBetween(bookedStart, bookedEnd, null, '[)')) ||
            (bookedStart.isBetween(selectedStart, selectedEnd, null, '[)') || bookedEnd.isBetween(selectedStart, selectedEnd, null, '[)'))
          );

          console.log(`Room ${room.id} is ${isUnavailable ? 'unavailable' : 'available'}`);
          return isUnavailable;
        }
        return false;
      });

      return { ...room, availability: isBooked ? "Unavailable" : "Available" };
    });

    console.log('New available rooms:', newAvailableRooms);
    setAvailableRooms(newAvailableRooms);
  };

  const handleProceed = () => {
    setSelectedDates(dateRange);
    router.push('/complete-your-booking');
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setAvailableRooms([...availableRooms]);
  };

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box mb={2}>
          <DateRangePicker
            startText="Start Date"
            endText="End Date"
            value={dateRange}
            onChange={(newRange) => {
              setDateRange(newRange);
              console.log('Selected date range:', newRange);
            }}
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
            roomName={room.second_name}
            occupancy={room.occupancy}
            rate={room.rate}
            image={room.image} // Pass the image prop
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
