// pages/api/sync-bookings.js
import axios from 'axios';
import { parseICS } from 'node-ical';
import { supabase } from '@/utils/supabase';

const airbnbIcalUrls = [
    'https://www.airbnb.com/calendar/ical/1101512343384815926.ics?s=bb32f23311402755c2e0f6fcca34d32d',
    'https://www.airbnb.com/calendar/ical/1101626413125793653.ics?s=638266da6c5d6a5b2ca1580e687905a9',
    'https://www.airbnb.com/calendar/ical/1101602891589896306.ics?s=a5427b26514f7ffb487e24658c2e5a0b',
    'https://www.airbnb.com/calendar/ical/1101569789363825898.ics?s=289fdd4756bb016c43fbe120eb3890ae',
    'https://www.airbnb.com/calendar/ical/1101570113624777524.ics?s=6b903e0cdc730694e245fee886dc8204'
];

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
            uid: event.uid,
            room_name: roomName,
            start_date: event.start ? event.start.toISOString() : null,
            end_date: event.end ? event.end.toISOString() : null,
            summary: event.summary || 'No Summary'
        }));
}

async function insertBookingsToSupabase(bookings) {
    try {
        // Log the data before inserting to Supabase
        console.log('Attempting to insert bookings:', JSON.stringify(bookings, null, 2));

        // Perform the insertion
        const { data, error } = await supabase.from('booking').insert(bookings);

        if (error) {
            console.error('Supabase returned error:', error);
            throw new Error(`Error inserting bookings: ${error.message}`);
        }

        return data;
    } catch (err) {
        // Catch any unexpected errors and provide more context
        console.error('Unexpected error during Supabase insertion:', err);
        throw new Error(`Unexpected error inserting bookings: ${err.message}`);
    }
}


export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const bookingsArray = await Promise.all(
                airbnbIcalUrls.map(async (url) => {
                    try {
                        const response = await axios.get(url, {
                            headers: { Accept: 'text/calendar' },
                            responseType: 'text'
                        });

                        const events = parseICS(response.data);
                        const roomName = calendarToRoomMap[url] || 'Unknown Room';

                        return extractBookingDetails(events, roomName);
                    } catch (innerError) {
                        console.error(`Error syncing calendar URL: ${url}, Details: ${innerError.message}`);
                        return []; // Return empty for failed URLs
                    }
                })
            );

            // Flatten the array before insertion
            const allBookings = bookingsArray.flat();

            // Insert data into Supabase
            await insertBookingsToSupabase(allBookings);

            res.status(200).json({ message: 'Bookings processed successfully and sent to Supabase', bookings: allBookings });
        } catch (error) {
            console.error('Overall sync failure:', error);
            res.status(500).json({ error: 'Failed to sync calendars', details: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}
async function testSingleBookingInsertion() {
    const sampleBooking = {
        uid: 'test-uid',
        room_name: 'Test Room',
        start_date: '2024-05-01T12:00:00Z',
        end_date: '2024-05-05T12:00:00Z',
        summary: 'Test Summary'
    };

    try {
        const { data, error } = await supabase.from('bookings').insert([sampleBooking]);

        if (error) {
            console.error('Error inserting single booking:', error);
            throw new Error(`Error inserting single booking: ${error.message}`);
        }

        console.log('Successfully inserted single booking:', data);
    } catch (err) {
        console.error('Unexpected error during single booking insertion:', err);
    }
}

// Test insertion by calling the function directly
testSingleBookingInsertion();
