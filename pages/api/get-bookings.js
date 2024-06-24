import { supabase } from "../../utils/supabase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Get today's date
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from("booking")
        .select("*")
        .gte("end_date", today); // Filter to get bookings that have not ended before today

      if (error) {
        console.error("Supabase Error:", error);
        throw error;
      }

      if (data && data.length > 0) {
        res.status(200).json(data);
      } else {
        console.log("No booking data found");
        res.status(200).json([]);
      }
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
