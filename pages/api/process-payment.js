import { Client, Environment } from "square";

const client = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { sourceId, amount } = req.body;

    try {
      console.log("Creating payment with:", { sourceId, amount });

      const response = await client.paymentsApi.createPayment({
        sourceId,
        amountMoney: {
          amount: amount, // amount in cents
          currency: "USD",
        },
        idempotencyKey: new Date().getTime().toString(), // unique identifier for this transaction
      });

      res.status(200).json(response.result);
    } catch (error) {
      console.error("Payment failed:", error);
      if (error.response) {
        const errorBody = await error.response.json();
        console.error("Detailed error response from Square:", errorBody);
        return res.status(500).json({ error: errorBody });
      }
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
