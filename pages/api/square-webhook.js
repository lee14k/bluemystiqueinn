import { supabase } from "../../utils/supabase";
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("Received a POST request");
    const body = req.body;

    try {
      const event = body;
      console.log("Webhook event received:", event);

      if (event.type === "payment.updated" && event.data.object.payment) {
        const payment = event.data.object.payment;
        const status = payment.status;

        console.log("Payment status:", status);

        if (status === "COMPLETED") {
          const orderId = payment.order_id;

          console.log("Order ID:", orderId);

          // Fetch the booking using the orderId
          const { data: bookingData, error: bookingError } = await supabase
            .from("booking")
            .select("id, payment_status, email, first_name, last_name, start_date, end_date, room_name")
            .eq("order_id", orderId)
            .single();

          if (bookingError) {
            console.error(`Error fetching booking: ${bookingError.message}`);
            // Acknowledge the event to stop retries, but log the issue
            return res.status(200).json({ success: true, error: "Booking not found" });
          }

          if (!bookingData) {
            console.error("Booking not found with the provided order ID.");
            // Acknowledge the event to stop retries, but log the issue
            return res.status(200).json({ success: true, error: "Booking not found" });
          }

          const { id: bookingId, room_id: roomId, payment_status, email, first_name, last_name, start_date, end_date, room_name } = bookingData;

          console.log("Booking ID:", bookingId);
          console.log("Room ID:", roomId);
          console.log("Current Payment Status:", payment_status);

          // Check if the booking is already confirmed to avoid redundant updates
          if (payment_status === "confirmed") {
            console.log("Booking is already confirmed, no update necessary.");
            return res.status(200).json({ success: true });
          }

          // Update the booking record in Supabase
          const { data: updatedBooking, error: updateBookingError } = await supabase
            .from("booking")
            .update({ payment_status: "confirmed" })
            .eq("id", bookingId);

          if (updateBookingError) {
            console.error(`Error updating booking: ${updateBookingError.message}`);
            // Acknowledge the event to stop retries, but log the issue
            return res.status(200).json({ success: true, error: "Error updating booking" });
          }
          console.log("Booking updated successfully:", updatedBooking);

          // Prepare booking details for the email
          const bookingDetails = {
            id: bookingId,
            first_name,
            last_name,
            email,
            start_date,
            end_date,
            room_name,
          };

          // Send confirmation emails
          try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/sendEmail`, {
              email,
              bookingDetails,
            });
            console.log("Emails sent successfully");
          } catch (emailError) {
            console.error("Error sending email:", emailError);
          }

          res.status(200).json({ success: true });
        } else {
          console.log(`Payment status is not completed: ${status}`);
          res.status(200).json({ success: true });
        }
      } else {
        console.log("Invalid event type");
        res.status(200).json({ success: true, error: "Invalid event type" });
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
