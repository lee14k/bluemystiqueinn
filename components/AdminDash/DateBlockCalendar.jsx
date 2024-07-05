import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import { Modal, Box, Typography, Button } from "@mui/material";

const DateBlockCalendar = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const roomColors = {
    1: "red",
    2: "blue",
    3: "green",
    4: "orange",
    5: "purple",
  };

  useEffect(() => {
    axios
      .get("/api/get-booking-cal")
      .then((response) => {
        const { bookings, blockedDates } = response.data;

        const bookingEvents = bookings.map((item) => ({
          id: `booking-${item.id}`, // Ensure each event has a unique ID
          title: item.first_name || "Booking",
          start: item.start_date,
          end: item.end_date,
          color: roomColors[item.room_name] || "gray",
        }));

        const blockedEvents = blockedDates.map((item) => ({
          id: `blocked-${item.id}`, // Ensure each event has a unique ID
          title: "Blocked" + item.room_id,
          start: item.start_date,
          end: item.end_date,
          color: "red", // Color for blocked dates
        }));

        setEvents([...bookingEvents, ...blockedEvents]);
      })
      .catch((error) => {
        console.error("Error fetching calendar events:", error);
      });
  }, []);

  const handleDateSelect = (selectInfo) => {
    const { startStr, endStr } = selectInfo;

    const roomIDs = [1, 2, 3, 4, 5];
    const unavailabilityEntries = roomIDs.map((room_id) => ({
      room_id,
      start_date: startStr,
      end_date: endStr,
    }));

    axios
      .post("/api/block-dates", { unavailabilityEntries })
      .then((response) => {
        setEvents((prevEvents) => [
          ...prevEvents,
          {
            id: `blocked-${Date.now()}`, // Ensure a unique ID for each new blocked event
            title: "Blocked",
            start: startStr,
            end: endStr,
            backgroundColor: "red",
          },
        ]);
      })
      .catch((error) => {
        console.error("Error blocking dates:", error);
      });
  };

  const handleEventClick = (clickInfo) => {
    if (clickInfo.event.title === "Blocked") {
      setSelectedEvent(clickInfo.event);
      setShowModal(true);
    }
  };

  const handleConfirmUnblock = () => {
    const startStr = selectedEvent.start.toISOString();
    const endStr = selectedEvent.end.toISOString();

    axios
      .delete("/api/remove-date-block", {
        data: { start_date: startStr, end_date: endStr },
      })
      .then((response) => {
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== selectedEvent.id)
        );
        setShowModal(false);
        setSelectedEvent(null);
      })
      .catch((error) => {
        console.error("Error removing date block:", error);
        setShowModal(false);
        setSelectedEvent(null);
      });
  };

  const handleCancelUnblock = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        selectable={true}
        select={handleDateSelect}
        eventClick={handleEventClick}
      />
      <Modal open={showModal} onClose={handleCancelUnblock}>
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
          <Typography variant="h6" component="h2">
            Confirm Unblock Date
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to unblock this date?
          </Typography>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmUnblock}
            >
              Yes
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancelUnblock}
            >
              No
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default DateBlockCalendar;
