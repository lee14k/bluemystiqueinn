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
    const { selectedDates, setSelectedDates, selectedRoom, setSelectedRoom, clearBooking } = useBooking();
    const [dateRange, setDateRange] = useState([null, null]);
    const [unavailabilityData, setUnavailabilityData] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [bookingData, setBookingData] = useState([]);
    const router = useRouter();
    const [selectedRoomDetails, setSelectedRoomDetails] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState(null);
    const [notificationModalOpen, setNotificationModalOpen] = useState(false);
    const [invalidDateModalOpen, setInvalidDateModalOpen] = useState(false);
    const [noDateSelectedModalOpen, setNoDateSelectedModalOpen] = useState(false);
    const [unavailableRoomModalOpen, setUnavailableRoomModalOpen] = useState(false);

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
        if (selectedRoom && isDateRangeValid) {
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
                return data.rate;
            } else {
                console.log(startDate)
                return null;
            }
        } catch (error) {
            console.error("Error fetching scheduled rates:", error);
            return null;
        }
    };

    const filterAvailableRooms = async () => {
        const startDate = dateRange[0]?.format("YYYY-MM-DD");
        const endDate = dateRange[1]?.format("YYYY-MM-DD");

        if (!startDate || !endDate) {
            return;
        }

        const roomsWithUpdatedRates = await updateRoomRates(rooms, startDate, endDate);

        const newAvailableRooms = roomsWithUpdatedRates.map((room) => {
            const isBooked = bookingData.some((booking) => {
                if (booking.room_name === room.id) {
                    const bookedStart = dayjs(booking.start_date);
                    const bookedEnd = dayjs(booking.end_date);
                    return dateRange[0].isBefore(bookedEnd) && dateRange[1].isAfter(bookedStart);
                }
                return false;
            });

            const isUnavailable = unavailabilityData.some((unavailable) => {
                if (unavailable.room_id === room.id) {
                    const unavailableStart = dayjs(unavailable.start_date);
                    const unavailableEnd = dayjs(unavailable.end_date);
                    return dateRange[0].isBefore(unavailableEnd) && dateRange[1].isAfter(unavailableStart);
                }
                return false;
            });

            return {
                ...room,
                availability: isBooked || isUnavailable ? "Unavailable" : "Available",
            };
        });

        setAvailableRooms(newAvailableRooms);

        // Check if the selected room is still available for the new date range
        const selectedRoomUpdated = newAvailableRooms.find((room) => room.id === selectedRoom?.id);
        if (selectedRoomUpdated?.availability !== "Available") {
            setSelectedRoom(null);
        }
    };

    const calculateSubtotalAndTotal = async () => {
        const days = dateRange[1].diff(dateRange[0], "day");
        let rate = selectedRoom.rate;

        const startDate = dateRange[0]?.format("YYYY-MM-DD");
        const endDate = dateRange[1]?.format("YYYY-MM-DD");

        const scheduledRate = await fetchScheduledRates(selectedRoom.id, startDate, endDate);

        if (scheduledRate) {
            rate = scheduledRate;
        }

        const subtotalAmount = days * rate;
        const totalAmount = subtotalAmount * 1.06;
        setSubtotal(subtotalAmount);
        setTotal(totalAmount);
    };

    const handleProceed = () => {
        if (!selectedRoom) {
            setNotificationModalOpen(true);
        } else if (!isDateRangeValid) {
            setNoDateSelectedModalOpen(true);
        } else if (selectedRoom.availability === "Unavailable") {
            setUnavailableRoomModalOpen(true);
        } else {
            setSelectedDates(dateRange);
            router.push("/complete-your-booking");
        }
    };

    const handleRoomSelect = (room) => {
        if (room.availability === "Available" && isDateRangeValid) {
            setSelectedRoom(room);
        } else {
            setUnavailableRoomModalOpen(true);
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
                const scheduledRate = await fetchScheduledRates(room.id, startDate, endDate);
                const updatedRate = scheduledRate || room.rate;

                return {
                    ...room,
                    rate: updatedRate,
                };
            })
        );

        return updatedRooms;
    };

    const isDateRangeValid = dateRange[0] !== null && dateRange[1] !== null;

    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box mb={2}>
                    <DateRangePicker
                        startText="Start Date"
                        endText="End Date"
                        value={dateRange}
                        onChange={(newRange) => {
                            // Only validate and potentially show error when both dates are selected
                            if (newRange[0] && newRange[1]) {
                                if (newRange[0].isSame(newRange[1], "day")) {
                                    setError("Start and end dates cannot be the same.");
                                    setDateRange([null, null]);
                                    setInvalidDateModalOpen(true);
                                } else if (newRange[0].isAfter(newRange[1])) {
                                    setError("End date must be after start date.");
                                    setDateRange([null, null]);
                                    setInvalidDateModalOpen(true);
                                } else {
                                    setError(null);
                                    setDateRange(newRange);
                                }
                            } else {
                                // If only one date is selected, just update the date range without validation
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
                        isDateRangeValid={isDateRangeValid}
                    />
                ))}
                <div className="flex flex-col gap-4">
                    <button
                        className="text-5xl h-1/3 w-full my-2 text-sky-900 my-2 bg-sky-300 rounded-2xl px-12 py-2 text-neutral-800 flex justify-center items-center"
                        onClick={handleProceed}
                    >
                        Proceed to Booking
                    </button>
                    <button
                        className="text-5xl h-1/3 w-full my-2 text-sky-900 my-2 bg-red-300 rounded-2xl px-12 py-2 text-neutral-800 flex justify-center items-center"
                        onClick={clearBooking}
                    >
                        Clear Booking
                    </button>
                    <div className="bg-sky-100 p-8 mb-4 h-1/2 flex flex-col justify-center rounded-2xl">
                        <div className="flex justify-between mb-2">
                            <span className="font-bold text-3xl">Subtotal:</span>
                            <span className="text-3xl">{isDateRangeValid ? `$${subtotal.toFixed(2)}` : "Please select a valid date!"}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="font-bold text-2xl">Sales Tax (6%):</span>
                            <span className="text-xl">{isDateRangeValid ? `$${(subtotal * 0.06).toFixed(2)}` : "-"}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-10">
                            <span className="text-4xl">Total:</span>
                            <span className="text-4xl">{isDateRangeValid ? `$${total.toFixed(2)}` : "-"}</span>
                        </div>
                    </div>
                </div>
            </div>

            <Modal open={modalOpen} onClose={handleClose} aria-labelledby="room-details-title" aria-describedby="room-details-description">
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: "90%", sm: 400, md: 500 },
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        p: { xs: 2, md: 4 },
                        maxHeight: { xs: "80vh", md: "90vh" },
                        overflowY: "auto",
                    }}
                >
                    {selectedRoomDetails && (
                        <>
                            <Typography id="room-details-title" variant="h6" component="h2">
                                {selectedRoomDetails.second_name}
                            </Typography>
                            <CardMedia component="img" height="140" image={selectedRoomDetails.image} alt={selectedRoomDetails.second_name} />
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
                            <Button onClick={handleClose} variant="contained" color="primary" sx={{ mt: 2 }}>
                                Close
                            </Button>
                        </>
                    )}
                </Box>
            </Modal>

            <Modal
                open={notificationModalOpen}
                onClose={() => setNotificationModalOpen(false)}
                aria-labelledby="notification-modal-title"
                aria-describedby="notification-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: "90%", sm: 400, md: 500 },
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        p: { xs: 2, md: 4 },
                    }}
                >
                    <Typography id="notification-modal-title" variant="h6" component="h2">
                        No Room Selected
                    </Typography>
                    <Typography id="notification-modal-description" sx={{ mt: 2 }}>
                        Please select a room before proceeding to booking.
                    </Typography>
                    <Button onClick={() => setNotificationModalOpen(false)} variant="contained" color="primary" sx={{ mt: 2 }}>
                        Close
                    </Button>
                </Box>
            </Modal>

            <Modal
                open={invalidDateModalOpen}
                onClose={() => setInvalidDateModalOpen(false)}
                aria-labelledby="invalid-date-modal-title"
                aria-describedby="invalid-date-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: "90%", sm: 400, md: 500 },
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        p: { xs: 2, md: 4 },
                    }}
                >
                    <Typography id="invalid-date-modal-title" variant="h6" component="h2">
                        Invalid Date Range
                    </Typography>
                    <Typography id="invalid-date-modal-description" sx={{ mt: 2 }}>
                        Please select a valid date range.
                    </Typography>
                    <Button onClick={() => setInvalidDateModalOpen(false)} variant="contained" color="primary" sx={{ mt: 2 }}>
                        Close
                    </Button>
                </Box>
            </Modal>

            <Modal
                open={noDateSelectedModalOpen}
                onClose={() => setNoDateSelectedModalOpen(false)}
                aria-labelledby="no-date-selected-modal-title"
                aria-describedby="no-date-selected-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: "90%", sm: 400, md: 500 },
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        p: { xs: 2, md: 4 },
                    }}
                >
                    <Typography id="no-date-selected-modal-title" variant="h6" component="h2">
                        No Dates Selected
                    </Typography>
                    <Typography id="no-date-selected-modal-description" sx={{ mt: 2 }}>
                        Please select a valid date range before proceeding to booking.
                    </Typography>
                    <Button onClick={() => setNoDateSelectedModalOpen(false)} variant="contained" color="primary" sx={{ mt: 2 }}>
                        Close
                    </Button>
                </Box>
            </Modal>

            <Modal
                open={unavailableRoomModalOpen}
                onClose={() => setUnavailableRoomModalOpen(false)}
                aria-labelledby="unavailable-room-modal-title"
                aria-describedby="unavailable-room-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: "90%", sm: 400, md: 500 },
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        p: { xs: 2, md: 4 },
                    }}
                >
                    <Typography id="unavailable-room-modal-title" variant="h6" component="h2">
                        Room Unavailable
                    </Typography>
                    <Typography id="unavailable-room-modal-description" sx={{ mt: 2 }}>
                        The selected room is unavailable. Please select a different room.
                    </Typography>
                    <Button onClick={() => setUnavailableRoomModalOpen(false)} variant="contained" color="primary" sx={{ mt: 2 }}>
                        Close
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default SelectRoom;
