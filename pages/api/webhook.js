import { supabase } from "../../utils/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const event = req.body;

    // Validate the webhook event
    const signature = req.headers["x-square-signature"];
    if (!isValidSignature(event, signature)) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    try {
      // Handle different event types
      if (event.type === "payment.updated") {
        const payment = event.data.object;
        const status = payment.status;

        console.log("Payment status:", status);

        if (payment.status === "COMPLETED") {
          // Update the booking record in the database
          const { data, error } = await supabase
            .from("booking")
            .update({ payment_status: "completed" })
            .eq("payment_id", payment.id);

          if (error) {
            throw new Error(`Error updating booking with payment ID: ${payment.id}`);
          }

          return res.status(200).json({ success: true });
        }
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error("Error handling webhook event:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function isValidSignature(event, signature) {
  // Implement your signature validation logic here
  return true; // Placeholder: always return true for now
}
