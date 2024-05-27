import React from "react";
import { useRouter } from "next/router";
import { GooglePay, CreditCard, PaymentForm } from "react-square-web-payments-sdk";
import { useBooking } from "../context/BookingContext";

const PayForm = ({ bookingId, onPaymentSuccess }) => {
  const router = useRouter();
  const { setPaymentId } = useBooking();

  const handlePaymentSuccess = async (paymentId) => {
    try {
      const response = await fetch(`/api/update-payment-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId, paymentStatus: "completed" }),
      });

      if (response.ok) {
        setPaymentId(paymentId);
        router.push(`/confirmation?paymentId=${paymentId}`);
      } else {
        console.error("Failed to update payment status:", await response.text());
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
            const response = await fetch("/api/process-payment", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                sourceId: token.token,
                amount: 180, // Ensure this is a number
              }),
            });

            if (response.ok) {
              const result = await response.json();
              console.log("Payment successful:", result);
              const paymentId = result.payment.id; // Capture the Square payment ID
              await handlePaymentSuccess(paymentId);
              onPaymentSuccess();
            } else {
              const errorText = await response.text();
              console.error("Payment failed:", errorText);
            }
          } catch (error) {
            console.error("Error during payment process:", error);
          }
        }}
        createPaymentRequest={() => ({
          countryCode: "US",
          currencyCode: "USD",
          total: {
            amount: "1", // Replace this with the actual amount in dollars
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
