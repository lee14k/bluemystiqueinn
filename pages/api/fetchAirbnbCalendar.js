import axios from 'axios';
import { parseICS } from 'node-ical';

// URLs to fetch `.ics` data from
const airbnbIcalUrls = [
    'https://www.airbnb.com/calendar/ical/1101512343384815926.ics?s=bb32f23311402755c2e0f6fcca34d32d',
    'https://www.airbnb.com/calendar/ical/1101626413125793653.ics?s=638266da6c5d6a5b2ca1580e687905a9',
    'https://www.airbnb.com/calendar/ical/1101602891589896306.ics?s=a5427b26514f7ffb487e24658c2e5a0b',
    'https://www.airbnb.com/calendar/ical/1101569789363825898.ics?s=289fdd4756bb016c43fbe120eb3890ae',
    'https://www.airbnb.com/calendar/ical/1101570113624777524.ics?s=6b903e0cdc730694e245fee886dc8204'
];

// Mapping of iCalendar URLs to room numbers/names
const calendarToRoomMap = {
    'https://www.airbnb.com/calendar/ical/1101512343384815926.ics?s=bb32f23311402755c2e0f6fcca34d32d': 'Room 1',
    'https://www.airbnb.com/calendar/ical/1101626413125793653.ics?s=638266da6c5d6a5b2ca1580e687905a9': 'Room 2',
    'https://www.airbnb.com/calendar/ical/1101602891589896306.ics?s=a5427b26514f7ffb487e24658c2e5a0b': 'Room 3',
    'https://www.airbnb.com/calendar/ical/1101569789363825898.ics?s=289fdd4756bb016c43fbe120eb3890ae': 'Room 4',
    'https://www.airbnb.com/calendar/ical/1101570113624777524.ics?s=6b903e0cdc730694e245fee886dc8204': 'Room 5'
};

function extractBookingDetails(events, roomName) {
    return Object.values(events)
        .filter(event => event.type === 'VEVENT')
        .map(event => ({
            start_date: event.start ? event.start.toISOString() : null,
            end_date: event.end ? event.end.toISOString() : null,
            summary: event.summary || 'No Summary',
            uid: event.uid,
            room_name: roomName
        }));
}

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Fetch and parse calendars from all provided URLs
            const bookingsArray = await Promise.all(
                airbnbIcalUrls.map(async (url) => {
                    try {
                        const response = await axios.get(url, {
                            headers: { Accept: 'text/calendar' },
                            responseType: 'text'
                        });

                        // Parse the `.ics` data using node-ical
                        const events = parseICS(response.data);

                        // Retrieve room name based on the URL
                        const roomName = calendarToRoomMap[url] || 'Unknown Room';

                        // Extract booking details and associate them with the corresponding room
                        return extractBookingDetails(events, roomName);
                    } catch (innerError) {
                        console.error(`Error syncing calendar URL: ${url}, Details: ${innerError.message}`);
                        return []; // Return an empty array for this calendar to avoid breaking the Promise.all loop
                    }
                })
            );

            // Flatten the array to combine all bookings into one response
            const allBookings = bookingsArray.flat();

            res.status(200).json({ message: 'Bookings processed successfully', bookings: allBookings });
        } catch (error) {
            console.error('Overall sync failure:', error);
            res.status(500).json({ error: 'Failed to sync calendars', details: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}
