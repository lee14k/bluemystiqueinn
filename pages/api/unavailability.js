// pages/api/unavailability.js

import { supabase } from '../../utils/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { room_id, start_date, end_date } = req.body;

    const { data, error } = await supabase
      .from('room_unavailability')
      .insert([
        { room_id, start_date, end_date }
      ]);

    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(200).json({ data });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
