import { supabase } from "@/utils/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { firstName, lastName, email, startDate, endDate, roomId, paymentStatus } = req.body;

    try {
      console.log("Received booking data:", { firstName, lastName, email, startDate, endDate, roomId, paymentStatus });

      const { data, error } = await supabase
        .from("booking")
        .insert([{ guest_name_one: firstName, guest_name_two: lastName, email, start_date: startDate, end_date: endDate, room_name: roomId, payment_status: paymentStatus }]);

        if (error) {
          console.error("Error inserting booking:", error);
          return res.status(500).json({ error: error.message, details: error });
        }
  
        if (!data || data.length === 0) {
          console.error("No data returned from insert operation");
          return res.status(500).json({ error: "Insert operation failed, no data returned" });
        }
  
        console.log("Booking saved successfully:", data);
        res.status(200).json({ bookingId: data[0].id });
      } catch (error) {
        console.error("Error saving booking:", error);
        res.status(500).json({ error: error.message });
      }
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }