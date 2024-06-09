import { supabase } from "../../utils/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      country,
      state,
      city,
      streetAddress,
      zipCode,
      startDate,
      endDate,
      roomId,
      paymentStatus,
      secondGuest,
    } = req.body;

    try {
      const { data, error } = await supabase
        .from("booking")
        .insert({
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone_number: phoneNumber,
          country: country,
          state: state,
          city: city,
          street_address: streetAddress,
          zip_code: zipCode,
          start_date: startDate,
          end_date: endDate,
          room_name: roomId,
          payment_status: paymentStatus,
          second_guest_first_name: secondGuest?.firstName || null,
          second_guest_last_name: secondGuest?.lastName || null,
          second_guest_email: secondGuest?.email || null,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Error creating booking:", error);
        return res.status(500).json({ error: error.message });
      }

      res.status(200).json({ bookingId: data.id });
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
