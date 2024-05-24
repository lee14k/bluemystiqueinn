import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PayForm from "../components/PayForm";
import { useBooking } from "../context/BookingContext";

const PaymentPage = () => {
  const router = useRouter();
  const { bookingId } = router.query;
  const { selectedRoom } = useBooking();
  const [loading, setLoading] = useState(true);

  const roomRate = selectedRoom ? selectedRoom.rate : 0; // Assume rate is in cents

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (!bookingId || !selectedRoom) {
      // Redirect to the home page or an error page if bookingId or selectedRoom is not present
      router.push('/');
    } else {
      console.log("Booking ID:", bookingId, "Room Rate:", roomRate);
      setLoading(false);
    }
  }, [router.isReady, bookingId, selectedRoom]);

  const handlePaymentSuccess = async () => {
    try {
      console.log("Handling payment success for booking ID:", bookingId);
      const response = await fetch(`/api/update-payment-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId, paymentStatus: "completed" }),
      });

      if (response.ok) {
        console.log("Payment status updated successfully");
        router.push("/confirmation");
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
      <h1>Complete Your Payment</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <PayForm bookingId={bookingId} roomRate={roomRate} onPaymentSuccess={handlePaymentSuccess} />
      )}
    </div>
  );
};

export default PaymentPage;
