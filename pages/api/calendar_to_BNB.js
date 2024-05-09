// pages/api/calendar.js
import ical from 'ical-generator';

export default function handler(req, res) {
    if (req.method === 'GET') {
        const calendar = ical({ domain: 'yourdomain.com', name: 'My Booking Calendar' });

        // Assume fetchBookings() fetches your latest booking data
        const bookings = fetchBookings(); // This should be an asynchronous fetch from your database

        bookings.forEach(booking => {
            calendar.createEvent({
                start: booking.start,
                end: booking.end,
                summary: `Reservation for ${booking.guestName}`,
                description: `Booking details for ${booking.guestName}`,
                url: `https://yourdomain.com/reservations/${booking.id}`
            });
        });

        // Set the correct headers to serve the .ics file
        res.setHeader('Content-Type', 'text/calendar;charset=utf-8');
        res.send(calendar.toString());
    } else {
        // Respond with method not allowed if not GET
        res.setHeader('Allow', ['GET']);
        res.status(405).end('Method Not Allowed');
    }
}
