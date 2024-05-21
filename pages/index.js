import Navbar from "@/components/FrontEnd/Navbar";
import HomeHeader from "@/components/HomeHeader";
import PhotoGallery from "@/components/FrontEnd/PhotoGallery";
import HomeCTA from "@/components/HomeCTA";
export default function Home() {
  return (
    <div>
      <Navbar />
      <HomeHeader />
      <HomeCTA/>
      <PhotoGallery/>
    </div>
  );
}
