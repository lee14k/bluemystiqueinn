import { supabase } from "../../utils/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { bookingData, foodData } = req.body;

    // Function to set the time to 12 AM
    const setToMidnight = (dateString) => {
      const date = new Date(dateString);
      date.setHours(0, 0, 0, 0);
      return date.toISOString();
    };

    try {
      // Adjust the start and end dates to 12 AM
      const startDate = setToMidnight(bookingData.startDate);
      const endDate = setToMidnight(bookingData.endDate);

      // Insert the booking data
      const { data: booking, error: bookingError } = await supabase
        .from("booking")
        .insert({
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
          payment_status: bookingData.paymentStatus,
          second_guest_first_name: bookingData.secondGuest?.firstName || null,
          second_guest_last_name: bookingData.secondGuest?.lastName || null,
          second_guest_email: bookingData.secondGuest?.email || null,
        })
        .select("id")
        .single();

      if (bookingError) {
        console.error("Error creating booking:", bookingError);
        return res.status(500).json({ error: bookingError.message });
      }

      const bookingId = booking.id;

      // Insert the dinner data if provided
      if (foodData.dinner) {
        const { allergies, preferences, specialOccasion, time } =
          foodData.dinner;
        const { error: dinnerError } = await supabase
          .from("guest_dining")
          .insert([
            {
              booking_id: bookingId,
              guest_name: `${bookingData.firstName} ${bookingData.lastName}`,
              allergies,
              preferences,
              special_occasion: specialOccasion,
              dinner_time: time,
              room_id: bookingData.roomId,
              charcuterie: false, // default to false for dinner
            },
          ]);

        if (dinnerError) {
          console.error("Dinner Error:", dinnerError);
          throw dinnerError;
        }
      }

      // Insert the charcuterie data if provided
      if (foodData.charcuterie) {
        const { allergies, preferences, specialOccasion, time } =
          foodData.charcuterie;
        const { error: charcuterieError } = await supabase
          .from("guest_dining")
          .insert([
            {
              booking_id: bookingId,
              guest_name: `${bookingData.firstName} ${bookingData.lastName}`,
              allergies,
              preferences,
              special_occasion: specialOccasion,
              dinner_time: time,
              room_id: bookingData.roomId,
              charcuterie: true, // set to true for charcuterie
            },
          ]);

        if (charcuterieError) {
          console.error("Charcuterie Error:", charcuterieError);
          throw charcuterieError;
        }
      }

      res.status(200).json({ bookingId });
    } catch (error) {
      console.error("General Error:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
