import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('/api/fetchAirbnbCalendar')
      .then(response => {
        const rawData = response.data;
        const cleanedEvents = [];

        rawData.forEach(item => {
          Object.keys(item).forEach(key => {
            if (item[key].type === 'VEVENT') {
              cleanedEvents.push({
                title: item[key].summary || 'No Title',
                start: item[key].start,
                end: item[key].end
              });
            }
          });
        });

        setEvents(cleanedEvents);
      })
      .catch(error => {
        console.error('Error fetching calendar events:', error);
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
