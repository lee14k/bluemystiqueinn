import { Client, Environment } from "square";
import { supabase } from "../../utils/supabase";

const client = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { sourceId, amount, bookingId } = req.body;

    // Log the incoming request body for debugging
    console.log("Received request body:", req.body);

    // Ensure bookingId is defined and is a number
    if (!bookingId || isNaN(bookingId)) {
      console.error("Invalid bookingId:", bookingId);
      return res.status(400).json({ error: "Invalid bookingId" });
    }

    try {
      const response = await client.paymentsApi.createPayment({
        sourceId,
        amountMoney: {
          amount: Number(amount), // Ensure amount is a number
          currency: "USD",
        },
        idempotencyKey: new Date().getTime().toString(), // unique identifier for this transaction
      });

      const paymentId = response.result.payment.id;

      // Log the payment ID and booking ID for debugging
      console.log('Payment ID:', paymentId);
      console.log('Booking ID:', bookingId);

      // Update the booking record with the paymentId
      const { data, error } = await supabase
        .from("booking")
        .update({ payment_id: paymentId })
        .eq("id", bookingId);

      if (error) {
        throw new Error(`Error updating booking with payment ID: ${error.message}`);
      }

      // Log the data after updating
      console.log('Updated booking with payment ID:', data);

      // Convert BigInt values to strings
      const result = JSON.parse(
        JSON.stringify(response.result, (_, value) => 
          typeof value === "bigint" ? value.toString() : value
        )
      );

      res.status(200).json(result);
    } catch (error) {
      console.error("Payment failed:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
