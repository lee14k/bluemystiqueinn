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
      router.push("/");
    } else {
      fetchBookingDetails(paymentId);
    }
  }, []);

  const fetchBookingDetails = async (paymentId) => {
    try {
      const response = await fetch(
        `/api/get-booking-details?paymentId=${paymentId}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched booking details:", data); // Log the fetched booking details
        setBookingDetails(data);
      } else {
        console.error(
          "Failed to fetch booking details:",
          await response.text()
        );
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
    <>
      <Navbar />

      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
        <h1 className="text-sm font-medium text-indigo-600">
          Payment successful
        </h1>
        <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Thanks for ordering
        </p>
        <p className="mt-2 text-base text-gray-500">
          We appreciate your booking request, we’re currently processing it. So
          hang tight and we’ll send you confirmation very soon!
        </p>{" "}
        <dl className="mt-16 text-lg font-medium grid grid-cols-5">
          <div>
            {" "}
            <dt className="text-gray-900">Booking ID:</dt>
            <dd className="mt-2 text-indigo-600">{bookingDetails.id}</dd>
          </div>
          <div>
            {" "}
            <dt className="text-gray-900">Name on reservation:</dt>
            <dd className="mt-2 text-indigo-600">
              {bookingDetails.guest_name_one} {bookingDetails.guest_name_two}
            </dd>
          </div>
          <div>
            {" "}
            <dt className="text-gray-900">Email:</dt>
            <dd className="mt-2 text-indigo-600">{bookingDetails.email}</dd>
          </div>

          <div>
            {" "}
            <dt className="text-gray-900">Dates Reserved:</dt>
            <dd className="mt-2 text-indigo-600">
              {new Date(bookingDetails.start_date).toLocaleDateString()} to{" "}
              {new Date(bookingDetails.end_date).toLocaleDateString()}{" "}
            </dd>
          </div>
        </dl>
        <p>Room ID: {bookingDetails.room_id}</p>
        <Footer />
      </div>
    </>
  );
};

export default Confirmation;
