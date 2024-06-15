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
    const room_id = 1; // Replace with the appropriate room ID

    axios
      .post("/api/block-dates", {
        room_id,
        start_date: startStr,
        end_date: endStr,
      })
      .then((response) => {
        // Add the blocked dates to the calendar
        setEvents((prevEvents) => [
          ...prevEvents,
          {
            title: "Blocked",
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
