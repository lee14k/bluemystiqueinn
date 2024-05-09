import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Update the endpoint to wherever your booking data comes from
    axios.get('/api/fetchBooking')
      .then(response => {
        const bookings = response.data.map(booking => ({
          start: booking.start_date,
          end: booking.end_date
        }));

        setEvents(bookings);
      })
      .catch(error => {
        console.error('Error fetching booking events:', error);
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

export default CalendarComponent;
