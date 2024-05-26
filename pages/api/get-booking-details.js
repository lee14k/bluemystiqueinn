import { supabase } from "../../utils/supabase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { paymentId } = req.query;

    try {
      const { data, error } = await supabase
        .from("booking")
        .select("*")
        .eq("payment_id", paymentId)
        .single();

      if (error) {
        throw error;
      }

      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
