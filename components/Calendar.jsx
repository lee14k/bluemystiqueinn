import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import React from 'react';

// Mock data from your Airbnb calendar parsing, replace with actual data fetch
const calendarEvents = [
  { title: 'Not available', start: '2024-04-30', end: '2024-05-03' },
  // Add more events based on the parsed data
];

const CalendarComponent = () => {
  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={calendarEvents}
    />
  );
};

export default CalendarComponent;
