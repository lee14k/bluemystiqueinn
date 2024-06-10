import React, { useState, useEffect } from "react";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import RoomCard from "../components/RoomCard";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useBooking } from "../context/BookingContext";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";

const SelectRoom = () => {
  const { selectedDates, setSelectedDates, selectedRoom, setSelectedRoom } =
    useBooking();
  const [dateRange, setDateRange] = useState([
    dayjs(selectedDates[0]),
    dayjs(selectedDates[1]),
  ]);
  const [rooms, setRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const router = useRouter();
  const [selectedRoomDetails, setSelectedRoomDetails] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchRooms();
    fetchBookingData();
  }, []);

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      filterAvailableRooms();
    }
  }, [dateRange, rooms, bookingData]);

  useEffect(() => {
    if (selectedDates[0] && selectedDates[1]) {
      setDateRange([dayjs(selectedDates[0]), dayjs(selectedDates[1])]);
    }
  }, [selectedDates]);

  const fetchRooms = async () => {
    try {
      const response = await fetch("/api/get-rooms");
      const roomsData = await response.json();
      if (response.ok) {
        setRooms(roomsData);
      } else {
        console.error("Error fetching rooms:", roomsData.error);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const fetchBookingData = async () => {
    try {
      const response = await fetch("/api/get-bookings");
      const data = await response.json();
      if (response.ok) {
        const completedBookings = data.filter(
          (booking) => booking.payment_status === "confirmed" || booking.payment_status === "completed"
        );
        setBookingData(completedBookings);
      } else {
        console.error("Error fetching bookings:", data.error);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const filterAvailableRooms = () => {
    const newAvailableRooms = rooms.map((room) => {
      const isBooked = bookingData.some((booking) => {
        if (booking.room_name === room.id) {
          const bookedStart = dayjs(booking.start_date);
          const bookedEnd = dayjs(booking.end_date).add(1, "day");
          return (
            dateRange[0].isBefore(bookedEnd) &&
            dateRange[1].isAfter(bookedStart)
          );
        }
        return false;
      });

      return { ...room, availability: isBooked ? "Unavailable" : "Available" };
    });

    setAvailableRooms(newAvailableRooms);
  };

  const handleProceed = () => {
    setSelectedDates(dateRange);
    router.push("/complete-your-booking");
  };

  const handleRoomSelect = (room) => {
    if (room.availability === "Available") {
      setSelectedRoom(room);
    }
  };

  const handleDetails = (room) => {
    setSelectedRoomDetails(room);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedRoomDetails(null);
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
      <div className="grid grid-cols-2">
        {availableRooms.map((room) => (
          <RoomCard
            key={room.id}
            availability={room.availability}
            roomName={room.second_name}
            occupancy={room.occupancy}
            rate={room.rate}
            image={room.image}
            onSelect={() => handleRoomSelect(room)}
            selected={selectedRoom?.id === room.id}
            onDetails={() => handleDetails(room)}
          />
        ))}
      </div>
      <button
        className="bg-gray-900 text-white py-2.5"
        onClick={handleProceed}
        disabled={!selectedRoom}
      >
        Proceed to Booking
      </button>

      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="room-details-title"
        aria-describedby="room-details-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedRoomDetails && (
            <>
              <Typography id="room-details-title" variant="h6" component="h2">
                {selectedRoomDetails.second_name}
              </Typography>
              <CardMedia
                component="img"
                height="140"
                image={selectedRoomDetails.image}
                alt={selectedRoomDetails.second_name}
              />
              <Typography id="room-details-description" sx={{ mt: 2 }}>
                Occupancy: {selectedRoomDetails.occupancy}
              </Typography>
              <Typography id="room-details-rate" sx={{ mt: 2 }}>
                Rate: ${selectedRoomDetails.rate}
              </Typography>
              <Typography id="room-details-rate" sx={{ mt: 2 }}>
                Amenities:
                <ul>
                  {selectedRoomDetails.amenities.map((amenity, index) => (
                    <li key={index}>{amenity}</li>
                  ))}
                </ul>
              </Typography>
              <Button
                onClick={handleClose}
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default SelectRoom;
