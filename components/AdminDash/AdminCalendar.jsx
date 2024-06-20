import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import axios from "axios";

const AdminCalendar = () => {
  const [events, setEvents] = useState([]);

  // Define a mapping of room IDs to colors
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
          title: item.first_name + "  " + item.room_name || "Booking",
          start: item.start_date.split("T")[0],
          end: item.end_date.split("T")[0],
          color: roomColors[item.room_name] || "gray",
        }));

        // Transform blocked dates into calendar events
        const blockedEvents = blockedDates.map((item) => ({
          title: "Blocked",
          start: item.start_date,
          end: item.end_date,
          color: "red", // Color for blocked dates
        }));

        // Combine bookings and blocked events
        setEvents([...bookingEvents, ...blockedEvents]);
      })
      .catch((error) => {
        console.error("Error fetching calendar events:", error);
      });
  }, []);
  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={events}
    />
  );
};

export default AdminCalendar;
