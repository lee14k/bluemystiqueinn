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
        const rawData = response.data;
        const cleanedEvents = rawData.map((item) => ({
          title: item.first_name || "No Title",
          start: item.start_date,
          end: item.end_date,
          color: roomColors[item.room_name] || "gray", // Apply color based on room_id, default to gray if room_id is not mapped
        }));

        setEvents(cleanedEvents);
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
