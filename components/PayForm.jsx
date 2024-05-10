import {
  ApplePay,
  GooglePay,
  CreditCard,
  PaymentForm,
  
} from "react-square-web-payments-sdk";

export default function PayForm() {
  return (
    <div>
      <PaymentForm
        applicationId="sq0idp-rWYxPgrlAdLSvzYb8OZw8w"
        cardTokenizeResponseReceived={async (token, verifiedBuyer) => {
          const response = await fetch("/api/pay", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              sourceId: token.token,
            }),
          });
          console.log(await response.json());
        }}
        createPaymentRequest={() => ({
          countryCode: "US",
          currencyCode: "USD",
          total: {
            amount: "1.00",
            label: "Total",
          },
        })}
        locationId="LFJC2AEE7NF9E"
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
}