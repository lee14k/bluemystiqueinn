import { supabase } from "../../utils/supabase";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  console.log("Received a request");

  async function sendBookingEmail(bookingData) {
    console.log("Preparing to send email with booking data:", bookingData);

    // Configure Nodemailer transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // SMTP username
        pass: process.env.SMTP_PASS, // SMTP password
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER, // recipient's email
      subject: "Booking Confirmation",
      text: `New Booking

Thank you for your booking. Here are the details:

Booking ID: ${bookingData.id}
Name: ${bookingData.first_name}
Room: ${bookingData.room_name}
Check-in Date: ${bookingData.start_date}
Check-out Date: ${bookingData.end_date}

We look forward to welcoming you.

Best regards,
Your Company`,
    };

    // Send the email
    try {
      let info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  try {
    if (req.method === "POST") {
      console.log("Received a POST request");
      const body = req.body;
      const event = body;

      console.log("Webhook event received:", event);

      if (event.type === "payment.updated" && event.data.object.payment) {
        const payment = event.data.object.payment;
        const order_id = payment.order_id;

        console.log("Order ID received:", order_id);

        if (!order_id) {
          console.error("Order ID is missing from the request body");
          return res.status(400).json({ error: "Order ID is required" });
        }

        const { data: bookingData, error: bookingError } = await supabase
          .from("booking")
          .select(
            "id, email, first_name, payment_status, start_date, end_date, room_name"
          )
          .eq("order_id", order_id)
          .single();

        if (bookingError) {
          console.error(`Error fetching booking: ${bookingError.message}`);
          return res.status(200).json({ error: "Error fetching booking" });
        }

        if (!bookingData) {
          console.error("Booking not found with the provided order ID");
          return res.status(200).json({ error: "Booking not found" });
        }

        console.log("Booking data fetched successfully:", bookingData);

        await sendBookingEmail(bookingData);

        res.status(200).json({ success: true });
      }
    } else {
      console.log(`Method ${req.method} not allowed`);
      res.setHeader("Allow", ["POST"]);
      res.status(200).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(200).json({ error: error.message });
  }
}
