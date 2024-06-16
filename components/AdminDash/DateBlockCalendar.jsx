import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

const DateBlockCalendar = () => {
  const [events, setEvents] = useState([]);

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

        // Transform bookings into calendar events
        const bookingEvents = bookings.map((item) => ({
          title: item.first_name || "Booking",
          start: item.start_date,
          end: item.end_date,
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

  const handleDateClick = (clickInfo) => {
    const startStr = clickInfo.event.start.toISOString();
    const endStr = clickInfo.event.end.toISOString();

    axios
      .delete("/api/remove-date-block", {
        data: { start_date: startStr, end_date: endStr },
      })
      .then((response) => {
        setEvents((prevEvents) =>
          prevEvents.filter(
            (event) => event.start !== startStr && event.end !== endStr
          )
        );
      })
      .catch((error) => {
        console.error("Error removing date block:", error);
      });
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      selectable={true}
      select={handleDateSelect}
      eventClick={handleDateClick}
    />
  );
};

export default DateBlockCalendar;
