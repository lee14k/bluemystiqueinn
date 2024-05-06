// pages/api/test-ics.js
import ical from 'node-ical';

function extractBookingDetails(events) {
    return Object.values(events)
        .filter(event => event.type === 'VEVENT') // Only process VEVENT types
        .map(event => ({
            start_date: event.start ? event.start.toISOString() : null,
            end_date: event.end ? event.end.toISOString() : null,
            summary: event.summary || 'No Summary',
            uid: event.uid
        }));
}

export default async function handler(req, res) {
    // Ensure that only the POST method is allowed
    if (req.method === 'POST') {
        try {
            // Parse the incoming `.ics` data
            const events = ical.sync.parseICS(req.body);

            // Extract relevant booking details for debugging
            const bookings = extractBookingDetails(events);

            // Log the extracted bookings for debugging purposes
            console.log('Parsed Bookings:', bookings);

            // Return the parsed bookings as JSON for verification
            res.status(200).json({ message: 'Bookings parsed successfully', bookings });
        } catch (error) {
            console.error('Error parsing bookings:', error);
            res.status(500).json({ error: 'Failed to parse bookings', details: error.message });
        }
    } else {
        // For any method other than POST, return a 405 Method Not Allowed response
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}
