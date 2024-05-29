import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GooglePay, CreditCard, PaymentForm } from "react-square-web-payments-sdk";
import { useBooking } from "../context/BookingContext";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('your-supabase-url', 'your-supabase-key');

const PayForm = ({ roomId, onPaymentSuccess }) => {
  const router = useRouter();
  const { setPaymentId } = useBooking();
  const [rate, setRate] = useState(null);

  useEffect(() => {
    const fetchRate = async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('rate')
        .eq('id', roomId)
        .single();

      if (error) {
        console.error('Error fetching room rate:', error);
      } else {
        setRate(data.rate);
      }
    };

    fetchRate();
  }, [roomId]);

  const handlePaymentSuccess = async (paymentId) => {
    try {
      const response = await fetch(`/api/update-payment-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId, paymentId, paymentStatus: "completed" }),
      });

      if (response.ok) {
        setPaymentId(paymentId);
        localStorage.setItem("paymentId", paymentId);
        router.push(`/confirmation`);
      } else {
        console.error("Failed to update payment status:", await response.text());
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  if (rate === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>Total Price: ${rate}</h3>
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
                amount: rate * 100, // Amount in cents
                roomId,
              }),
            });

            if (response.ok) {
              const result = await response.json();
              console.log("Payment successful:", result);
              const paymentId = result.payment.id;
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
            amount: (rate / 100).toFixed(2),
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
