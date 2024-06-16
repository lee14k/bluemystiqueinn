import { supabase } from "../../utils/supabase";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { start_date, end_date } = req.body;

    const { data, error } = await supabase
      .from("booking")
      .delete()
      .eq("start_date", start_date)
      .eq("end_date", end_date);

    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(200).json({ data });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
