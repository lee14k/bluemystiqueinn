import { supabase } from '../../utils/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { start_date, end_date } = req.body;

    // Fetch all room IDs
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('id');

    if (roomsError) {
      return res.status(500).json({ error: roomsError.message });
    }

    const unavailabilityEntries = rooms.map(room => ({
      room_id: room.id,
      start_date,
      end_date
    }));

    // Insert all unavailability entries
    const { data, error } = await supabase
      .from('room_unavailability')
      .insert(unavailabilityEntries);

    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(200).json({ data });
    }
  } else if (req.method === 'GET') {
    // Add the logic to get existing blocked dates
    const { data, error } = await supabase
      .from('room_unavailability')
      .select('*');

    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(200).json(data);
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
