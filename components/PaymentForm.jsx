"use client";
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";

export default function PaymentForm() {
  const appId = "sq0idp-rWYxPgrlAdLSvzYb8OZw8w";
  const locationId = "LFJC2AEE7NF9E";

  return (
    <PaymentForm
      applicationId={appId}
      locationId={locationId}
      cardTokenizeResponseReceived={async (token) => {
        const result = await submitPayment(token.token);
        console.log(result);
      }}
    >
      <CreditCard />
    </PaymentForm>
  );
}

//actual location code TFWW2S5Z9F8DB