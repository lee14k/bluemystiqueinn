// pages/api/get-room-rate.js

import { supabase } from "../../utils/supabase";

async function getScheduledRate(roomId, startDate, endDate) {
  const { data, error } = await supabase
      .from("scheduled_rates")
      .select("rate")
      .eq("room_id", roomId)
      .lte("start_date", startDate)
      .gte("end_date", endDate)
      .single();

  if (error) {
    console.error("Error fetching scheduled rate:", error.message);
    return null;
  }

  return data ? data.rate : null;
}

async function getRoomRate(roomId) {
  const { data, error } = await supabase
      .from("rooms")
      .select("rate")
      .eq("id", roomId)
      .single();

  if (error) {
    console.error("Error fetching room rate:", error.message);
    throw new Error("Error fetching room rate");
  }

  return data.rate;
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { roomId, startDate, endDate } = req.body;

    try {
      const scheduledRate = await getScheduledRate(roomId, startDate, endDate);
      const roomRate = scheduledRate || await getRoomRate(roomId);

      res.status(200).json({ rate: roomRate });
    } catch (error) {
      console.error("Failed to fetch room rate:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
