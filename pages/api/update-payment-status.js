import { supabase } from "../../utils/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { bookingId, paymentId, paymentStatus } = req.body;

    try {
      // Update the booking record with the paymentId and paymentStatus
      const { data, error } = await supabase
        .from("booking")
        .update({ payment_id: paymentId, payment_status: paymentStatus })
        .eq("id", bookingId);

      if (error) {
        throw new Error(`Error updating booking with payment ID: ${error.message}`);
      }

      // Log the data after updating for debugging
      console.log('Updated booking with payment ID:', data);

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
