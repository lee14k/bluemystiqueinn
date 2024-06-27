import { supabase } from '../../utils/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { roomId, startDate, endDate } = req.body;

  // Check if the required parameters are provided
  if (!roomId || !startDate || !endDate) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  // Log the received parameters to debug
  console.log("Received parameters:", { roomId, startDate, endDate });

  // Query to fetch the scheduled rates from the rate_picker table
  const { data, error } = await supabase
    .from('rate_picker')
    .select('rate')
    .eq('room_id', roomId)
    .or(`start_date.lte.${endDate},end_date.gte.${startDate}`);

  // Log the query result
  console.log("Query result:", { data, error });

  // Handle errors
  if (error) {
    console.error("Supabase error:", error);
    return res.status(500).json({ error: error.message });
  }

  // Return the rate if found, otherwise return null
  if (data.length > 0) {
    return res.status(200).json({ rate: data[0].rate });
  } else {
    return res.status(200).json({ rate: null });
  }
}
