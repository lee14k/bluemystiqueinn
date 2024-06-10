import { supabase } from "../../utils/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("Received a POST request");
    const body = req.body;

    try {
      // Parse the webhook event
      const event = body;
      console.log("Webhook event received:", event);

      if (event.type === "payment.updated" && event.data.object.payment) {
        const payment = event.data.object.payment;
        const status = payment.status;

        console.log("Payment status:", status);

        if (status === "COMPLETED") {
          const paymentId = payment.id;

          console.log("Payment ID:", paymentId);

          // Fetch booking ID and room ID using payment ID
          const { data: bookingData, error: bookingError } = await supabase
            .from("booking")
            .select("id, room_name")
            .eq("payment_id", paymentId)
            .single();

          if (bookingError || !bookingData) {
            throw new Error(`Booking not found or error fetching booking: ${bookingError?.message}`);
          }

          const { id: bookingId, room_id: roomId } = bookingData;

          console.log("Booking ID:", bookingId);
          console.log("Room ID:", roomId);

          // Update the booking record in Supabase
          const { data: updatedBooking, error: updateBookingError } = await supabase
            .from("bookings")
            .update({ payment_status: "confirmed" })
            .eq("id", bookingId);

          if (updateBookingError) {
            throw new Error(`Error updating booking: ${updateBookingError.message}`);
          }
          console.log("Booking updated successfully:", updatedBooking);

          // Mark the room as unavailable
          const { data: updatedRoom, error: updateRoomError } = await supabase
            .from("rooms")
            .update({ available: false })
            .eq("id", roomId);

          if (updateRoomError) {
            throw new Error(`Error updating room: ${updateRoomError.message}`);
          }
          console.log("Room marked as unavailable:", updatedRoom);

          res.status(200).json({ success: true });
        } else {
          console.log(`Payment status is not completed: ${status}`);
          res.status(200).json({ success: true });
        }
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
