import { Client, Environment } from "square";
import { supabase } from "../../utils/supabase";

const client = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { sourceId, amount, bookingId, roomId, numberOfDays } = req.body;

    // Log the incoming request body for debugging
    console.log("Received request body:", req.body);

    // Ensure bookingId is defined and is a number
    if (!bookingId || isNaN(bookingId)) {
      console.error("Invalid bookingId:", bookingId);
      return res.status(400).json({ error: "Invalid bookingId" });
    }

    try {
      // Fetch the room details from the database
      const { data: roomData, error: roomError } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", roomId)
        .single();

      if (roomError || !roomData) {
        throw new Error(`Error fetching room data: ${roomError.message}`);
      }

      const lineItems = [
        {
          name: `Room ${roomData.name}`,
          quantity: String(numberOfDays),
          basePriceMoney: {
            amount: roomData.rate,
            currency: "USD",
          },
          taxes: [
            {
              name: "Sales Tax",
              percentage: "6.00",
              scope: "LINE_ITEM",
            },
          ],
        },
      ];

      const order = {
        idempotencyKey: new Date().getTime().toString(),
        order: {
          locationId: process.env.SQUARE_LOCATION_ID,
          lineItems,
          state: "OPEN",
        },
      };

      // Create the order
      const orderResponse = await client.ordersApi.createOrder(order);
      const orderId = orderResponse.result.order.id;

      // Create a payment link
      const paymentLinkResponse = await client.checkoutApi.createPaymentLink({
        idempotencyKey: new Date().getTime().toString(),
        orderId,
        checkoutOptions: {
          askForShippingAddress: false,
        },
      });

      const paymentLink = paymentLinkResponse.result.paymentLink.url;

      // Update the booking record with the paymentLink
      const { data, error } = await supabase
        .from("booking")
        .update({ payment_link: paymentLink })
        .eq("id", bookingId);

      if (error) {
        throw new Error(`Error updating booking with payment link: ${error.message}`);
      }

      // Log the data after updating
      console.log("Updated booking with payment link:", data);

      res.status(200).json({ paymentLink });
    } catch (error) {
      console.error("Payment failed:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
