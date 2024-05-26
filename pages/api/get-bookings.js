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
      res.status(200).json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
