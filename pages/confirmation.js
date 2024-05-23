import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Confirmation = () => {
  const router = useRouter();
  const { bookingId } = router.query;
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    if (!bookingId) {
      // Redirect to the home page or an error page if bookingId is not present
      router.push('/');
    } else {
      fetchBookingDetails(bookingId);
    }
  }, [bookingId]);

  const fetchBookingDetails = async (id) => {
    try {
      const response = await fetch(`/api/get-booking-details?bookingId=${id}`);
      if (response.ok) {
        const data = await response.json();
        setBookingDetails(data);
      } else {
        console.error("Failed to fetch booking details:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };

  if (!bookingDetails) {
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
