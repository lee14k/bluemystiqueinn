import Navbar from "@/components/FrontEnd/Navbar";
import HomeHeader from "@/components/HomeHeader";
import PhotoGallery from "@/components/FrontEnd/PhotoGallery";
import HomeCTA from "@/components/HomeCTA";
import AboutFill from "@/components/FrontEnd/AboutFill";
import Footer from "@/components/FrontEnd/Footer";

export default function Home() {
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
