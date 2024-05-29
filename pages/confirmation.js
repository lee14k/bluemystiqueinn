import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "@/components/FrontEnd/Navbar";
import Footer from "@/components/FrontEnd/Footer";

const Confirmation = () => {
  const router = useRouter();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const paymentId = localStorage.getItem("paymentId");
    if (!paymentId) {
      // Redirect to the home page if paymentId is not present
      router.push('/');
    } else {
      fetchBookingDetails(paymentId);
    }
  }, []);

  const fetchBookingDetails = async (paymentId) => {
    try {
      const response = await fetch(`/api/get-booking-details?paymentId=${paymentId}`);
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
      <Navbar/>
      <h1>Booking Confirmation</h1>
      <p>Booking ID: {bookingDetails.id}</p>
      <p>First Name: {bookingDetails.first_name}</p>
      <p>Last Name: {bookingDetails.last_name}</p>
      <p>Email: {bookingDetails.email}</p>
      <p>Start Date: {new Date(bookingDetails.start_date).toLocaleDateString()}</p>
      <p>End Date: {new Date(bookingDetails.end_date).toLocaleDateString()}</p>
      <p>Room ID: {bookingDetails.room_id}</p>
      <p>Payment Status: {bookingDetails.payment_status}</p>
      <Footer/>
    </div>
  );
};

export default Confirmation;
