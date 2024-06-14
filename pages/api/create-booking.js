// pages/api/create-booking.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { firstName, lastName, email, phoneNumber, country, state, city, streetAddress, zipCode, startDate, endDate, roomId, paymentStatus, secondGuest, dinner, charcuterie } = req.body;

    try {
      // Insert the booking data
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert([{ firstName, lastName, email, phoneNumber, country, state, city, streetAddress, zipCode, startDate, endDate, roomId, paymentStatus, secondGuest }])
        .single();

      if (bookingError) {
        throw bookingError;
      }

      // Insert the dinner data if provided
      if (dinner) {
        const { allergies, preferences, specialOccasion, time } = dinner;
        const { error: dinnerError } = await supabase
          .from('guest_dining')
          .insert([{
            booking_id: bookingData.id,
            guest_name: `${firstName} ${lastName}`,
            allergies,
            preferences,
            special_occasion: specialOccasion,
            dinner_time: time,
            room_id: roomId,
            charcuterie: false // default to false for dinner
          }]);

        if (dinnerError) {
          throw dinnerError;
        }
      }

      // Insert the charcuterie data if provided
      if (charcuterie) {
        const { allergies, preferences, specialOccasion, time } = charcuterie;
        const { error: charcuterieError } = await supabase
          .from('guest_dining')
          .insert([{
            booking_id: bookingData.id,
            guest_name: `${firstName} ${lastName}`,
            allergies,
            preferences,
            special_occasion: specialOccasion,
            dinner_time: time,
            room_id: roomId,
            charcuterie: true // set to true for charcuterie
          }]);

        if (charcuterieError) {
          throw charcuterieError;
        }
      }

      res.status(200).json({ bookingId: bookingData.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
