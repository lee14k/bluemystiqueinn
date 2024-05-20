import { supabase } from "../../utils/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { bookingId, paymentStatus } = req.body;

    try {
      const { data, error } = await supabase
        .from("bookings")
        .update({ payment_status: paymentStatus })
        .eq("id", bookingId);

      if (error) {
        throw error;
      }

      res.status(200).json(data);
    } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
