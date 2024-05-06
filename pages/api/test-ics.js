// pages/api/test-ics.js
import { supabase } from '../../utils/supabaseClient';
import ical from 'node-ical';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const events = ical.sync.parseICS(req.body);
            const bookings = Object.values(events).map(event => ({
                start_date: event.start.toISOString(),
                end_date: event.end.toISOString(),
                summary: event.summary,
                uid: event.uid
            }));

            // Write bookings to Supabase
            const { data, error } = await supabase
                .from('bookings')
                .upsert(bookings, { returning: 'minimal' }); // 'minimal' avoids returning data and speeds up the query

            if (error) throw error;

            res.status(200).json({ message: 'Bookings processed successfully', bookings });
        } catch (error) {
            console.error('Error processing bookings:', error);
            res.status(500).json({ error: 'Failed to process bookings', details: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
