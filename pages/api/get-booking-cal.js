import { supabase } from "../../utils/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { unavailabilityEntries } = req.body;

    const { data, error } = await supabase
      .from("booking")
      .insert(unavailabilityEntries);

    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(200).json({ data });
    }
  } else if (req.method === "GET") {
    // Fetch bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from("booking")
      .select("*")
      .in("payment_status", ["completed", "confirmed"]);

    // Fetch blocked dates
    const { data: blockedDates, error: blockedDatesError } = await supabase
      .from("room_unavailability")
      .select("*");

    if (bookingsError || blockedDatesError) {
      res
        .status(500)
        .json({ error: bookingsError?.message || blockedDatesError?.message });
    } else {
      res.status(200).json({ bookings, blockedDates });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
