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
  const [unavailabilityData, setUnavailabilityData] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const router = useRouter();
  const [selectedRoomDetails, setSelectedRoomDetails] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null); // State for error message

  useEffect(() => {
    fetchRooms();
    fetchBookingData();
    fetchUnavailabilityData();
  }, []);

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      filterAvailableRooms();
    }
  }, [dateRange, rooms, bookingData, unavailabilityData]);

  useEffect(() => {
    if (selectedDates[0] && selectedDates[1]) {
      setDateRange([dayjs(selectedDates[0]), dayjs(selectedDates[1])]);
    }
  }, [selectedDates]);

  useEffect(() => {
    if (selectedRoom && dateRange[0] && dateRange[1]) {
      calculateSubtotalAndTotal();
    }
  }, [selectedRoom, dateRange]);

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
          (booking) =>
            booking.payment_status === "confirmed" ||
            booking.payment_status === "completed"
        );
        setBookingData(completedBookings);
      } else {
        console.error("Error fetching bookings:", data.error);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchUnavailabilityData = async () => {
    try {
      const response = await fetch("/api/unavailability");
      const data = await response.json();
      if (response.ok) {
        setUnavailabilityData(data);
      } else {
        console.error("Error fetching unavailability data:", data.error);
      }
    } catch (error) {
      console.error("Error fetching unavailability data:", error);
    }
  };

  const fetchScheduledRates = async (roomId, startDate, endDate) => {
    try {
      const response = await fetch("/api/get-scheduled-rates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId, startDate, endDate }),
      });

      const data = await response.json();
      if (response.ok) {
        return data.rate; // Assuming your API returns the applicable rate
      } else {
        console.error("Error fetching scheduled rates:", data.error);
        return null;
      }
    } catch (error) {
      console.error("Error fetching scheduled rates:", error);
      return null;
    }
  };

  const filterAvailableRooms = async () => {
    const startDate = dateRange[0].format("YYYY-MM-DD");
    const endDate = dateRange[1].format("YYYY-MM-DD");

    const roomsWithUpdatedRates = await updateRoomRates(
      rooms,
      startDate,
      endDate
    );

    const newAvailableRooms = roomsWithUpdatedRates.map((room) => {
      const isBooked = bookingData.some((booking) => {
        if (booking.room_name === room.id) {
          const bookedStart = dayjs(booking.start_date);
          const bookedEnd = dayjs(booking.end_date);
          return (
            dateRange[0].isBefore(bookedEnd) &&
            dateRange[1].isAfter(bookedStart)
          );
        }
        return false;
      });

      const isUnavailable = unavailabilityData.some((unavailable) => {
        if (unavailable.room_id === room.id) {
          const unavailableStart = dayjs(unavailable.start_date);
          const unavailableEnd = dayjs(unavailable.end_date);
          return (
            dateRange[0].isBefore(unavailableEnd) &&
            dateRange[1].isAfter(unavailableStart)
          );
        }
        return false;
      });

      return {
        ...room,
        availability: isBooked || isUnavailable ? "Unavailable" : "Available",
      };
    });

    setAvailableRooms(newAvailableRooms);
  };

  const calculateSubtotalAndTotal = async () => {
    const days = dateRange[1].diff(dateRange[0], "day");
    let rate = selectedRoom.rate;

    const startDate = dateRange[0].format("YYYY-MM-DD");
    const endDate = dateRange[1].format("YYYY-MM-DD");

    const scheduledRate = await fetchScheduledRates(
      selectedRoom.id,
      startDate,
      endDate
    );

    if (scheduledRate) {
      rate = scheduledRate;
    }

    const subtotalAmount = days * rate;
    const totalAmount = subtotalAmount * 1.06;
    setSubtotal(subtotalAmount);
    setTotal(totalAmount);
  };

  const handleProceed = () => {
    setSelectedDates(dateRange);
    router.push("/complete-your-booking");
  };

  const handleRoomSelect = (room) => {
    if (room.availability === "Available" && isDateRangeValid) {
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

  const updateRoomRates = async (rooms, startDate, endDate) => {
    const updatedRooms = await Promise.all(
      rooms.map(async (room) => {
        const scheduledRate = await fetchScheduledRates(
          room.id,
          startDate,
          endDate
        );
        const updatedRate = scheduledRate || room.rate;

        return {
          ...room,
          rate: updatedRate,
        };
      })
    );

    return updatedRooms;
  };

  const isDateRangeValid =
    dateRange[0] && dateRange[1] && !dateRange[0].isSame(dateRange[1], "day");

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box mb={2}>
          <DateRangePicker
            startText="Start Date"
            endText="End Date"
            value={dateRange}
            onChange={(newRange) => {
              if (
                newRange &&
                newRange[0] &&
                newRange[1] &&
                newRange[0].isSame(newRange[1], "day")
              ) {
                setError("Start and end dates cannot be the same.");
                setDateRange([null, null]);
              } else {
                setError(null);
                setDateRange(newRange);
              }
            }}
            renderInput={(startProps, endProps) => (
              <>
                <TextField {...startProps} />
                <Box sx={{ mx: 2 }}>to</Box>
                <TextField {...endProps} />
              </>
            )}
          />
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </LocalizationProvider>
      <div className="grid lg:grid-cols-2">
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
            isDateRangeValid={isDateRangeValid} // Pass the prop to RoomCard
          />
        ))}
        <div className="flex flex-col gap-4">
          <button
            className="text-5xl h-1/3 w-full my-2 text-sky-900 my-2 bg-sky-300 rounded-2xl px-12 py-2 text-neutral-800 flex justify-center items-center"
            onClick={handleProceed}
            disabled={!selectedRoom}
          >
            Proceed to Booking
          </button>
          <div className="bg-sky-100 p-8 mb-4 h-1/2 flex flex-col justify-center rounded-2xl">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-3xl">Subtotal:</span>
              <span className="text-3xl">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold text-2xl">Sales Tax (6%):</span>
              <span className="text-xl">${(subtotal * 0.06).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-10">
              <span className="text-4xl">Total:</span>
              <span className="text-4xl">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

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
            width: { xs: "90%", sm: 400, md: 500 }, // Responsive width
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: { xs: 2, md: 4 }, // Responsive padding
            maxHeight: { xs: "80vh", md: "90vh" }, // Max height for scrollable content
            overflowY: "auto", // Enable vertical scrolling
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
                Description: {selectedRoomDetails.room_description}
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
