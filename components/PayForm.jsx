import React from "react";
import { useRouter } from "next/router";
import { GooglePay, CreditCard, PaymentForm } from "react-square-web-payments-sdk";

const PayForm = ({ bookingId, onPaymentSuccess }) => {
  const router = useRouter();

  return (
    <div>
      <PaymentForm
        applicationId="sandbox-sq0idb-U9BPDxZinOKI4wq-jusMbQ"
        locationId="LFJC2AEE7NF9E"
        cardTokenizeResponseReceived={async (token, verifiedBuyer) => {
          try {
            console.log("Token received:", token.token);
            
            const response = await fetch("/api/process-payment", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                sourceId: token.token,
                amount: 100, // Replace this with the actual amount in cents
              }),
            });

            if (response.ok) {
              const result = await response.json();
              console.log("Payment successful:", result);
              onPaymentSuccess();
              router.push(`/confirmation?bookingId=${bookingId}`);
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
            amount: "1.00", // Replace this with the actual amount in dollars
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
