import { useEffect } from "react";
import { useRouter } from "next/router";
import BookingForm from "@/components/BookingForm";
import Navbar from "@/components/FrontEnd/Navbar";
import { useBooking } from "../context/BookingContext";

export default function CompleteYourBooking() {
  const { selectedDates, selectedRoom } = useBooking();
  const router = useRouter();

  useEffect(() => {
    if (!selectedDates || !selectedRoom) {
      // Redirect to the home page or an error page if selectedDates or selectedRoom is not present
      router.push('/');
    }
  }, [selectedDates, selectedRoom]);

  return (
    <div>
      <Navbar />
      {selectedDates && selectedRoom ? <BookingForm /> : <div>Loading...</div>}
    </div>
  );
}
