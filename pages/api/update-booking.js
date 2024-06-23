import { supabase } from "../../utils/supabase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { data: bookings, error } = await supabase
        .from("booking")
        .select("*");

      if (error) {
        console.error("Error fetching bookings:", error);
        return res.status(500).json({ error: error.message });
      }

      res.status(200).json(bookings);
    } catch (error) {
      console.error("General Error:", error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "PATCH") {
    const { bookingId, bookingData, foodData } = req.body;

    if (!bookingId) {
      return res.status(400).json({ error: "Missing bookingId" });
    }

    try {
      // Adjust the start and end dates to 12 AM
      const startDate = bookingData.startDate;
      const endDate = bookingData.endDate;

      // Update the booking data
      const { data: booking, error: bookingError } = await supabase
        .from("booking")
        .update({
          first_name: bookingData.firstName,
          last_name: bookingData.lastName,
          email: bookingData.email,
          phone_number: bookingData.phoneNumber,
          country: bookingData.country,
          state: bookingData.state,
          city: bookingData.city,
          street_address: bookingData.streetAddress,
          zip_code: bookingData.zipCode,
          start_date: startDate,
          end_date: endDate,
          room_name: bookingData.roomId,
          second_guest_first_name: bookingData.secondGuest?.firstName || null,
          second_guest_last_name: bookingData.secondGuest?.lastName || null,
          second_guest_email: bookingData.secondGuest?.email || null,
        })
        .eq('id', bookingId);

      if (bookingError) {
        console.error("Error updating booking:", bookingError);
        return res.status(500).json({ error: bookingError.message });
      }

      // Log the update transaction
      const { error: logError } = await supabase
        .from("booking_updates_log")
        .insert({
          booking_id: bookingId,
          updated_by: "Elizabeth",
          updated_at: new Date().toISOString(),
          changes: bookingData
        });

      if (logError) {
        console.error("Error logging update:", logError);
        return res.status(500).json({ error: logError.message });
      }

      res.status(200).json({ bookingId });
    } catch (error) {
      console.error("General Error:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "PATCH"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
