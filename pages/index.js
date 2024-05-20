import Calendar from "../components/AdminDash/Calendar";
import Navbar from "@/components/FrontEnd/Navbar";
import HomeHeader from "@/components/HomeHeader";
import PhotoGallery from "@/components/FrontEnd/PhotoGallery";
export default function Home() {
  return (
    <div>
      <Navbar />
      <HomeHeader />
      <PhotoGallery/>
    </div>
  );
}
