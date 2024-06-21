import React from "react";
import { useRouter } from "next/router";
import PayForm from "../components/PayForm";
import { useBooking } from "../context/BookingContext";
import { ClipLoader } from "react-spinners";

const PaymentPage = () => {
  const router = useRouter();
  const { bookingId } = router.query;

  const handlePaymentSuccess = async () => {
    try {
      const response = await fetch(`/api/update-payment-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId, paymentStatus: "completed" }),
      });

      if (response.ok) {
        router.push("/confirmation");
      } else {
        console.error("Failed to update payment status:", await response.text());
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  return (
    <div>
      <ClipLoader color="#000" loading={true} size={150} />
      <PayForm bookingId={bookingId} onPaymentSuccess={handlePaymentSuccess} />
    </div>
  );
};

export default PaymentPage;
