import { supabase } from "../../utils/supabase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { paymentId } = req.query;

    try {
      // Query the database for the booking details using the paymentId
      const { data, error } = await supabase
        .from("booking")
        .select("*")
        .eq("payment_id", paymentId);

      if (error) {
        console.error("Error fetching booking details:", error);
        return res.status(500).json({ error: error.message });
      }

      if (!data || data.length === 0) {
        console.warn("No booking details found for this payment ID");
        return res.status(404).json({ error: "No booking details found for this payment ID." });
      }

      res.status(200).json(data[0]);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
