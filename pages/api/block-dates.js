import { supabase } from '../../utils/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { unavailabilityEntries } = req.body;

    if (!unavailabilityEntries || !Array.isArray(unavailabilityEntries) || unavailabilityEntries.length === 0) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

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
