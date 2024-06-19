import Navbar from "@/components/FrontEnd/Navbar";
import HomeHeader from "@/components/HomeHeader";
import PhotoGallery from "@/components/FrontEnd/PhotoGallery";
import HomeCTA from "@/components/HomeCTA";
import AboutFill from "@/components/FrontEnd/AboutFill";
import Footer from "@/components/FrontEnd/Footer";
import { supabase } from "../utils/supabase";
import { useEffect } from "react";
export default function Home() {
  useEffect(() => {
    console.log("Setting up subscription...");
    const subscription = supabase
      .channel("public:booking")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "booking" },
        (payload) => {
          console.log("New booking inserted:", payload);
          const bookingDetails = payload.new;
          fetch("/api/send-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ bookingDetails }),
          });
        }
      )
      .subscribe();
  }, []);
  return (
    <div>
      <Navbar />
      <HomeHeader />
      <HomeCTA />
      <PhotoGallery />
      <AboutFill />
      <Footer />
    </div>
  );
}
