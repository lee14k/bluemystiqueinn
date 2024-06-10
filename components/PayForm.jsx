import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useBooking } from "../context/BookingContext";
import { supabase } from '../utils/supabase'; // Adjust the import path as needed

const PayForm = ({ bookingId, onPaymentSuccess }) => {
  const router = useRouter();
  const { selectedRoom, setPaymentId, selectedDates } = useBooking();
  const [rate, setRate] = useState(null);
  const [paymentLink, setPaymentLink] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedRoom || !selectedRoom.id) {
      console.error("selectedRoom is undefined or has no id");
      setLoading(false); // Stop loading if there's an error
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
        setLoading(false); // Stop loading if there's an error
      } else {
        setRate(data.rate);
        setLoading(false); // Stop loading when the rate is fetched
      }
    };

    fetchRate();
  }, [selectedRoom]);

  const handleCreatePaymentLink = async () => {
    if (!bookingId || !rate || !selectedDates || selectedDates.length !== 2) {
      console.error("Missing required data for creating payment link");
      return;
    }

    try {
      const numberOfDays = Math.max(1, Math.round((new Date(selectedDates[1]) - new Date(selectedDates[0])) / (1000 * 60 * 60 * 24)));
      const totalAmount = rate * numberOfDays * 100; // Convert to cents

      const response = await fetch("/api/create-payment-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmount,
          bookingId,
          roomId: selectedRoom.id,
          numberOfDays,
          metadata: {
            bookingId,
            roomId: selectedRoom.id
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setPaymentLink(result.paymentLink);
      } else {
        console.error("Failed to create payment link:", await response.text());
      }
    } catch (error) {
      console.error("Error creating payment link:", error);
    }
  };

  useEffect(() => {
    if (rate !== null) {
      handleCreatePaymentLink();
    }
  }, [rate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (paymentLink) {
    window.location.href = paymentLink;
    return <div>Redirecting to payment...</div>;
  }

  return (
    <div>
      <h3>Total Price: ${(rate * (selectedDates.length > 1 ? Math.max(1, Math.round((new Date(selectedDates[1]) - new Date(selectedDates[0])) / (1000 * 60 * 60 * 24))) : 1)).toFixed(2)}</h3>
      <button
        onClick={handleCreatePaymentLink}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default PayForm;
