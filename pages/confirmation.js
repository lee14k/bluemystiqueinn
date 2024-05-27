import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Confirmation = () => {
  const router = useRouter();
  const { paymentId } = router.query;
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) {
      // Router is not ready yet, so wait
      return;
    }

    if (!paymentId) {
      // Redirect to the home page or an error page if paymentId is not present
      router.push('/');
    } else {
      fetchBookingDetails(paymentId);
    }
  }, [router.isReady, paymentId]);

  const fetchBookingDetails = async (id) => {
    try {
      const response = await fetch(`/api/get-booking-details?paymentId=${id}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched booking details:", data); // Log the fetched booking details
        setBookingDetails(data);
      } else {
        console.error("Failed to fetch booking details:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !bookingDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Booking Confirmation</h1>
      <p>Booking ID: {bookingDetails.id}</p>
      <p>First Name: {bookingDetails.first_name}</p>
      <p>Last Name: {bookingDetails.last_name}</p>
      <p>Email: {bookingDetails.email}</p>
      <p>Start Date: {new Date(bookingDetails.start_date).toLocaleDateString()}</p>
      <p>End Date: {new Date(bookingDetails.end_date).toLocaleDateString()}</p>
      <p>Room ID: {bookingDetails.room_id}</p>
      <p>Payment Status: {bookingDetails.payment_status}</p>
    </div>
  );
};

export default Confirmation;
