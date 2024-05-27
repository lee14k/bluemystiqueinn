import { Client, Environment } from "square";

const client = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { sourceId, amount } = req.body;

    try {
      const response = await client.paymentsApi.createPayment({
        sourceId,
        amountMoney: {
          amount: Number(amount), // Ensure amount is a number
          currency: "USD",
        },
        idempotencyKey: new Date().getTime().toString(), // unique identifier for this transaction
      });

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
