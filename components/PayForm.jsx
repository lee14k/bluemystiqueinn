import React from "react";
import {
  ApplePay,
  GooglePay,
  CreditCard,
  PaymentForm,
} from "react-square-web-payments-sdk";

const PayForm = ({ bookingId, onPaymentSuccess }) => {
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
                bookingId,
              }),
            });

            if (response.ok) {
              onPaymentSuccess();
            } else {
              console.error("Payment failed:", await response.text());
            }
          } catch (error) {
            console.error("Error during payment process:", error);
          }
        }}
        createPaymentRequest={() => ({
          countryCode: "US",
          currencyCode: "USD",
          total: {
            amount: "1.00", // Replace this with the actual amount
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
