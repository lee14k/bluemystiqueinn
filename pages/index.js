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
    const startSubscription = async () => {
      try {
        const response = await fetch('/api/subscribe-to-bookings', {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Failed to start subscription');
        }

        console.log('Subscription started successfully');
      } catch (error) {
        console.error('Error starting subscription:', error);
      }
    };

    startSubscription();
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
