import { supabase } from "../../utils/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const event = req.body;

    // Validate the webhook event
    const signature = req.headers["x-square-signature"];
    if (!isValidSignature(event, signature)) {
      return res.status(400).json({ error: "Invalid signature" });
    }
    try {
      // Parse the webhook event

      if (event.type === "payment.updated" && event.data.object.payment) {
        const payment = event.data.object.payment;
        const tenderId = payment.tenders[0].id;
        const bookingId = payment.metadata.bookingId; // Assuming you stored bookingId in metadata
        const roomId = payment.metadata.roomId; // Assuming you stored roomId in metadata

        console.log("Payment updated:", payment);

        // Update the booking record in Supabase
        const { data, error } = await supabase
          .from("booking")
          .update({ payment_id: tenderId, status: "confirmed" })
          .eq("id", bookingId);

        if (error) {
          throw new Error(`Error updating booking: ${error.message}`);
        }

        // Mark the room as unavailable
        const { data: roomData, error: roomError } = await supabase
          .from("rooms")
          .update({ available: false })
          .eq("id", roomId);

        if (roomError) {
          throw new Error(`Error updating room: ${roomError.message}`);
        }

        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ error: "Invalid event type" });
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
