import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, bookingDetails } = req.body;

    try {
      // Create a transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER, // generated ethereal user
          pass: process.env.EMAIL_PASS, // generated ethereal password
        },
      });

      // Email content
      const emailContent = `
        <h1>Booking Confirmation</h1>
        <p>Thank you for your booking!</p>
        <p>Booking ID: ${bookingDetails.id}</p>
        <p>First Name: ${bookingDetails.first_name}</p>
        <p>Last Name: ${bookingDetails.last_name}</p>
        <p>Email: ${bookingDetails.email}</p>
        <p>Start Date: ${new Date(bookingDetails.start_date).toLocaleDateString()}</p>
        <p>End Date: ${new Date(bookingDetails.end_date).toLocaleDateString()}</p>
        <p>Room: ${bookingDetails.room_name}</p>
      `;

      // Send email to the user
      await transporter.sendMail({
        from: `"Blue Mystique Inn" <${process.env.EMAIL_FROM}>`, // sender address
        to: email, // list of receivers
        subject: "Booking Confirmation", // Subject line
        html: emailContent, // html body
      });

      // Send email to the designated user
      await transporter.sendMail({
        from: `"New Booking Alert" <${process.env.EMAIL_FROM}>`, // sender address
        to: process.env.ADMIN_EMAIL, // list of receivers
        subject: "New Booking Notification", // Subject line
        html: emailContent, // html body
      });

      res.status(200).json({ message: "Emails sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Error sending email" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
