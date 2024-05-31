import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GooglePay, CreditCard, PaymentForm } from "react-square-web-payments-sdk";
import { useBooking } from "../context/BookingContext";
import { supabase } from '../utils/supabase'; // Adjust the import path as needed

const PayForm = ({ bookingId, onPaymentSuccess }) => {
  const router = useRouter();
  const { selectedRoom, setPaymentId } = useBooking();
  const [rate, setRate] = useState(null);

  useEffect(() => {
    if (!selectedRoom || !selectedRoom.id) {
      console.error("selectedRoom is undefined or has no id");
      return;
    }

    console.log("Selected Room ID:", selectedRoom.id);

    const fetchRate = async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('rate')
        .eq('id', selectedRoom.id)
        .single();

      if (error) {
        console.error('Error fetching room rate:', error);
      } else {
        setRate(data.rate);
      }
    };

    fetchRate();
  }, [selectedRoom]);

  const handlePaymentSuccess = async (paymentId) => {
    try {
      console.log("Updating payment status for booking ID:", bookingId, "with payment ID:", paymentId);
      const response = await fetch(`/api/update-payment-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId, paymentId, paymentStatus: "completed" }),
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
            console.log("Booking ID before payment:", bookingId); // Log the booking ID before making the API call
            const response = await fetch("/api/process-payment", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                sourceId: token.token,
                amount: rate * 100, // Amount in cents
                bookingId, // Send bookingId with the payment request
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
            amount: rate.toFixed(2),
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
