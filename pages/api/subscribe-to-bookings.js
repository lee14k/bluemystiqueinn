import { supabase } from "../../utils/supabase";
import nodemailer from "nodemailer";

const startSubscription = async () => {
  supabase
    .channel("public:booking")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "booking" },
      async (payload) => {
        const bookingDetails = payload.new;
        (payload) => console.log(payload)
        // Add your conditional logic here
        if (
          bookingDetails.payment_status === "confirmed" ||
          bookingDetails.payment_status === "completed"
        ) {
          // Create a transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });

          // Email content
          const emailContent = `
          <h1>New Booking Notification</h1>
          <p>A new booking has been made!</p>
          <p>Booking ID: ${bookingDetails.id}</p>
          <p>First Name: ${bookingDetails.first_name}</p>
          <p>Last Name: ${bookingDetails.last_name}</p>
          <p>Email: ${bookingDetails.email}</p>
          <p>Start Date: ${new Date(
            bookingDetails.start_date
          ).toLocaleDateString()}</p>
          <p>End Date: ${new Date(
            bookingDetails.end_date
          ).toLocaleDateString()}</p>
          <p>Room: ${bookingDetails.room_name}</p>
        `;

          // Send email to the owner
          await transporter.sendMail({
            from: `"New Booking Alert" <${process.env.EMAIL_FROM}>`,
            to: process.env.ADMIN_EMAIL,
            subject: "New Booking Notification",
            html: emailContent,
          });
        }
      }
    )
    .subscribe();
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await startSubscription();
      res.status(200).json({ message: "Subscription started" });
    } catch (error) {
      console.error("Error starting subscription:", error);
      res.status(500).json({ error: "Error starting subscription" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
