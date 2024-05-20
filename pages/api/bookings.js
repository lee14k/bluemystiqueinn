import { supabase } from "../../utils/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, startDate, endDate, roomId, paymentStatus } = req.body;

    try {
      console.log("Received booking data:", { name, email, startDate, endDate, roomId, paymentStatus });

      const { data, error } = await supabase
        .from("bookings")
        .insert([{ name, email, start_date: startDate, end_date: endDate, room_id: roomId, payment_status: paymentStatus }]);

      if (error) {
        console.error("Error inserting booking:", error);
        throw error;
      }

      console.log("Booking saved successfully:", data);
      res.status(200).json({ bookingId: data[0].id });
    } catch (error) {
      console.error("Error saving booking:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
