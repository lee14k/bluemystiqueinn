import React from "react";
import { useRouter } from "next/router";
import { GooglePay, CreditCard, PaymentForm } from "react-square-web-payments-sdk";
import { useBooking } from "../context/BookingContext";

const PayForm = ({ bookingId, roomRate, onPaymentSuccess }) => {
  const router = useRouter();
  const { setPaymentId } = useBooking();

  const handlePaymentSuccess = async (paymentId) => {
    try {
      console.log("Updating payment status with bookingId:", bookingId, "and paymentId:", paymentId);
      const response = await fetch(`/api/update-payment-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId, paymentStatus: "completed" }),
      });

      if (response.ok) {
        console.log("Payment status updated successfully");
        setPaymentId(paymentId);
        router.push(`/confirmation?paymentId=${paymentId}`);
      } else {
        const errorText = await response.text();
        console.error("Failed to update payment status:", errorText);
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  return (
    <div>
      <PaymentForm
        applicationId="sandbox-sq0idb-U9BPDxZinOKI4wq-jusMbQ"
        locationId="LFJC2AEE7NF9E"
        cardTokenizeResponseReceived={async (token, verifiedBuyer) => {
          try {
            const amountMoney = {
              amount: roomRate, // Ensure this is an integer representing cents
              currency: "USD"
            };
            console.log("Token received:", token);
            console.log("Amount Money:", amountMoney);

            const response = await fetch("/api/process-payment", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                sourceId: token.token,
                amountMoney,
                idempotencyKey: new Date().getTime().toString() // Unique key for each transaction
              }),
            });

            const result = await response.json();
            console.log("Payment API response:", result);

            if (response.ok) {
              const paymentId = result.payment.id; // Capture the Square payment ID
              await handlePaymentSuccess(paymentId);
              onPaymentSuccess();
            } else {
              console.error("Payment failed:", result);
            }
          } catch (error) {
            console.error("Error during payment process:", error);
          }
        }}
        createPaymentRequest={() => ({
          countryCode: "US",
          currencyCode: "USD",
          total: {
            amount: (roomRate / 100).toFixed(2), // Convert room rate to dollars and ensure it's a string
            label: "Total",
          },
        })}
      >
        <GooglePay />
        <CreditCard
          buttonProps={{
            css: {
              backgroundColor: "#771520",
              fontSize: "14px",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#530f16",
              },
            },
          }}
        />
      </PaymentForm>
    </div>
  );
};

export default PayForm;
