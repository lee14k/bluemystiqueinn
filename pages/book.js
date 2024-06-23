import BookingForm from "@/components/BookingForm";
import Navbar from "@/components/FrontEnd/Navbar";
import PayForm from "@/components/PayForm";
import SelectRoom from "@/components/SelectRoom";
import { Della_Respira } from "next/font/google";
import Footer from "@/components/FrontEnd/Footer";
const della = Della_Respira({ subsets: ["latin"], weight: "400" });
import Link from "next/link";
export default function Book() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col justify-center items-center my-24 container mx-auto ">
        <h1 className={`text-6xl ${della.className}`}>Book your Stay</h1>
        <p className="text-2xl my-2 container mx-auto text-center">
          We’re so happy to have you! Questions? Send us a
          message. Want more information on our rooms? Click the details button on each card or check out our rooms page.
        </p>
        <div className="grid lg:grid-cols-2 ">
        <Link href="/contact">
          {" "}
          <button className="text-xl my-2 text-sky-900 my-2 bg-sky-300 rounded-2xl px-12 py-2 text-neutral-800 rounded-2xl px-12 py-2 text-neutral-800">
            Contact Us
          </button>
        </Link>
        <Link href="/rooms">
          {" "}
          <button className="text-xl my-2 text-sky-900 my-2 bg-sky-300 rounded-2xl px-12 py-2 text-neutral-800 rounded-2xl px-12 py-2 text-neutral-800">
            Our Rooms
          </button>
        </Link>
        </div>
      </div>
      <SelectRoom />
      <Footer/>
    </div>
  );
}
