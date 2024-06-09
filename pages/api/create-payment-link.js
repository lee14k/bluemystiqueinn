import { Client, Environment } from "square";
import { supabase } from "../../utils/supabase";

const client = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { amount, bookingId, roomId, numberOfDays } = req.body;

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

      console.log("Fetched room data:", roomData);

      const lineItems = [
        {
          name: `Room ${roomData.name}`,
          quantity: String(numberOfDays),
          basePriceMoney: {
            amount: roomData.rate * 100, // amount in cents
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

      console.log("Constructed line items:", lineItems);

      if (lineItems.length === 0) {
        throw new Error("Line items are empty. Please check the room details and number of days.");
      }

      // Create a payment link using quick_pay
      const paymentLinkResponse = await client.checkoutApi.createPaymentLink({
        idempotencyKey: new Date().getTime().toString(),
        quickPay: {
          name: `Room Booking: ${roomData.name}`,
          priceMoney: {
            amount: amount, // amount already in cents
            currency: "USD"
          },
          locationId: process.env.SQUARE_LOCATION_ID,
        },
        checkoutOptions: {
          askForShippingAddress: false,
        },
      });

      const paymentLink = paymentLinkResponse.result.paymentLink.url;

      console.log("Created payment link:", paymentLink);

      // Update the booking record with the paymentLink
      const { data, error } = await supabase
        .from("booking")
        .update({ payment_link: paymentLink })
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
