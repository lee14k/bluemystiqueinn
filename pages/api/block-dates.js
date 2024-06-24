import { supabase } from '../../utils/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { room_id, start_date, end_date } = req.body;

    if (!room_id || !start_date || !end_date) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const unavailabilityEntries = [
      { room_id, start_date, end_date },
      { room_id: 1, start_date, end_date },
      { room_id: 2, start_date, end_date },
      { room_id: 3, start_date, end_date },
      { room_id: 4, start_date, end_date },
      { room_id: 5, start_date, end_date },
    ];

    const { data, error } = await supabase
      .from('room_unavailability')
      .insert(unavailabilityEntries);

    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(200).json({ data });
    }
  } else if (req.method === 'GET') {
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
