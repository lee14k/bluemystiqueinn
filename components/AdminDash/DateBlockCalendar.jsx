import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // For date selection
import axios from "axios";

const DateBlockCalendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get("/api/get-booking-cal")
      .then((response) => {
        const rawData = response.data;
        const cleanedEvents = rawData.map((item) => ({
          title: item.first_name || "No Title",
          start: item.start_date,
          end: item.end_date,
        }));

        setEvents(cleanedEvents);
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
        // Add the blocked dates to the calendar for visualization
        setEvents((prevEvents) => [
          ...prevEvents,
          {
            title: "All Rooms Blocked",
            start: startStr,
            end: endStr,
            backgroundColor: "red", // Optional: to highlight blocked dates
          },
        ]);
      })
      .catch((error) => {
        console.error("Error blocking dates:", error);
      });
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      selectable={true}
      select={handleDateSelect}
    />
  );
};

export default DateBlockCalendar;
