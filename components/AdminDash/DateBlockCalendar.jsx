import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const DateBlockCalendar = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [memo, setMemo] = useState("");
  const [selectedRange, setSelectedRange] = useState({
    startStr: "",
    endStr: "",
  });
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [showRemoveModal, setShowRemoveModal] = useState(false);

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
          title:
            item.first_name + " " + item.last_name + "  " + item.room_name ||
            "Booking",
          start: item.start_date,
          end: item.end_date,
          color: roomColors[item.room_name] || "gray",
        }));

        const blockedEvents = blockedDates.map((item) => ({
          id: `blocked-${item.id}-${item.room_id}`, // Ensure each event has a unique ID
          title: `Blocked Room ${item.room_id}`,
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
    setSelectedRange({ startStr, endStr });
    setShowModal(true);
  };

  const handleConfirmBlock = () => {
    const { startStr, endStr } = selectedRange;
    const roomIDs = selectedRoom === "all" ? [1, 2, 3, 4, 5] : [selectedRoom];
    const unavailabilityEntries = roomIDs.map((room_id) => ({
      room_id,
      start_date: startStr,
      end_date: endStr,
      memo,
    }));

    axios
      .post("/api/block-dates", { unavailabilityEntries })
      .then((response) => {
        setEvents((prevEvents) => [
          ...prevEvents,
          ...roomIDs.map((room_id) => ({
            id: `blocked-${Date.now()}-${room_id}`, // Ensure a unique ID for each new blocked event
            title: `Blocked Room ${room_id}`,
            start: startStr,
            end: endStr,
            backgroundColor: "red",
          })),
        ]);
        setShowModal(false);
        setMemo("");
        setSelectedRoom("all");
      })
      .catch((error) => {
        console.error("Error blocking dates:", error);
      });
  };

  const handleEventClick = (clickInfo) => {
    if (clickInfo.event.title.startsWith("Blocked")) {
      setSelectedEvent(clickInfo.event);
      setShowRemoveModal(true);
    }
  };

  const handleConfirmUnblock = () => {
    const { id, start, end } = selectedEvent;
    const idParts = id.split('-');
    const block_id = idParts[1]; // Extract the block_id from the event ID
    const room_id = idParts[2]; // Extract the room_id from the event ID

    if (!block_id || !room_id) {
      console.error('Block ID or Room ID is undefined. Event ID:', id);
      return;
    }

    const requestData = {
      id: block_id,
      room_id,
      start_date: start.toISOString(),
      end_date: end.toISOString(),
    };

    console.log("Sending DELETE request with data:", requestData);

    axios
      .delete("/api/remove-date-block", { data: requestData })
      .then((response) => {
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== selectedEvent.id)
        );
        setShowRemoveModal(false);
        setSelectedEvent(null);
      })
      .catch((error) => {
        console.error("Error removing date block:", error);
        setShowRemoveModal(false);
        setSelectedEvent(null);
      });
  };

  const handleCancel = () => {
    setShowModal(false);
    setMemo("");
    setSelectedRoom("all");
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
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
      <Modal open={showModal} onClose={handleCancel}>
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
            Add Block Memo
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="room-select-label">Select Room</InputLabel>
            <Select
              labelId="room-select-label"
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              label="Select Room"
            >
              <MenuItem value="all">All Rooms</MenuItem>
              <MenuItem value={1}>Room 1</MenuItem>
              <MenuItem value={2}>Room 2</MenuItem>
              <MenuItem value={3}>Room 3</MenuItem>
              <MenuItem value={4}>Room 4</MenuItem>
              <MenuItem value={5}>Room 5</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Memo"
            fullWidth
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmBlock}
            >
              Block Dates
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={showRemoveModal} onClose={handleCancelRemove}>
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
              onClick={handleCancelRemove}
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
