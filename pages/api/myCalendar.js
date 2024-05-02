// pages/api/myCalendar.js
import { ical } from 'ical-generator';

export default function handler(req, res) {
  const cal = ical({domain: 'yourdomain.com', name: 'My Calendar'});

  // Add events to the calendar
  cal.createEvent({
    start: new Date(),
    end: new Date(new Date().setHours(new Date().getHours() + 1)),
    summary: 'Test Event',
    description: 'This is a test event',
  });

  // More events can be added similarly

  // Set headers and send the iCal data
  res.setHeader('Content-Type', 'text/calendar');
  res.send(cal.toString());
}
