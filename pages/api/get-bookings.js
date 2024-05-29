import { supabase } from "../../utils/supabase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("booking")
        .select("*");

      if (error) {
        console.error("Supabase Error:", error);
        throw error;
      }

      console.log("Fetched booking data:", data);

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