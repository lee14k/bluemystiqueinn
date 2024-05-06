// pages/api/store-ics.js
import ical from 'node-ical';
import { supabase } from '../../utils/supabaseClient';

function extractBookingDetails(events) {
    return Object.values(events)
        .filter(event => event.type === 'VEVENT')
        .map(event => ({
            start_date: event.start ? event.start.toISOString() : null,
            end_date: event.end ? event.end.toISOString() : null,
            summary: event.summary || 'No Summary',
            uid: event.uid
        }));
}

async function saveBookings(bookings) {
    const { data, error } = await supabase
        .from('bookings')
        .upsert(bookings, { returning: 'minimal' });

    if (error) {
        throw new Error(`Failed to save bookings: ${error.message}`);
    }
    return data;
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const events = ical.sync.parseICS(req.body);
            const bookings = extractBookingDetails(events);

            await saveBookings(bookings);

            res.status(200).json({ message: 'Bookings processed successfully', bookings });
        } catch (error) {
            console.error('Error processing bookings:', error);
            res.status(500).json({ error: 'Failed to process bookings', details: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}
