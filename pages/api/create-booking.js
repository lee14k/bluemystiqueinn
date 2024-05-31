import { supabase } from "../../utils/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, startDate, endDate, roomId } = req.body;

    try {
      const { data, error } = await supabase
        .from("booking")
        .insert({
          guest_name_one: name,
          email,
          start_date: startDate,
          end_date: endDate,
          room_name: roomId,
          payment_status: "pending",
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
