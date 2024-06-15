import { Client, Environment } from "square";
import { supabase } from "../../utils/supabase";

const client = new Client({
  environment: Environment.Production,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { amount, bookingId, roomId, numberOfDays } = req.body;

    try {
      // Fetch the room details from the database
      const { data: roomData, error: roomError } = await supabase
        .from("rooms")
        .select("second_name, rate")
        .eq("id", roomId)
        .single();

      if (roomError || !roomData) {
        throw new Error(`Error fetching room data: ${roomError.message}`);
      }

      const roomName = roomData.second_name;
      if (!roomName) {
        throw new Error("Room name is undefined. Please check the room data.");
      }

      const lineItems = [
        {
          name: `Room ${roomName}`,
          quantity: String(numberOfDays),
          basePriceMoney: {
            amount: roomData.rate * 100, // amount in cents
            currency: "USD",
          },
        },
      ];

      // Create a payment link
      const paymentLinkResponse = await client.checkoutApi.createPaymentLink({
        idempotencyKey: new Date().getTime().toString(),
        order: {
          locationId: process.env.SQUARE_LOCATION_ID,
          lineItems: lineItems,
          taxes: [
            {
              name: 'state',
              percentage: '6',
            },
          ],
        },
        checkoutOptions: {
          askForShippingAddress: false,
          redirectUrl: `${process.env.REDIRECT_URL}?bookingId=${bookingId}`,
        },
      });

      const paymentLink = paymentLinkResponse.result.paymentLink.url;
      const orderId = paymentLinkResponse.result.paymentLink.orderId;

      console.log(`Payment link created: ${paymentLink}`);
      console.log(`Order ID: ${orderId}`);

      // Update the booking record with the paymentLink and orderId
      const { data, error } = await supabase
        .from("booking")
        .update({ payment_link: paymentLink, order_id: orderId })
        .eq("id", bookingId);

      if (error) {
        throw new Error(`Error updating booking with payment link: ${error.message}`);
      }

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
