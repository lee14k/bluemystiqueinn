import BookingForm from "@/components/BookingForm";
import Navbar from "@/components/FrontEnd/Navbar";
import PayForm from "@/components/PayForm";
import SelectRoom from "@/components/SelectRoom";
import { Della_Respira } from "next/font/google";
const della = Della_Respira({ subsets: ["latin"], weight: "400" });
export default function Book() {
  return (
    <div>
      <Navbar />

      <h1 className={`text-6xl mx-24 ${della.className}`}>Book your Stay</h1>
      <p>
        We’re so happy to have you! Book your stay here. Questions? Send Us a
        Message.
      </p>
      <SelectRoom/>
    </div>
  );
}
