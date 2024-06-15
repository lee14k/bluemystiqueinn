import Navbar from "@/components/FrontEnd/Navbar";
import Footer from "@/components/FrontEnd/Footer";
import FoodCTA from "@/components/FoodCTA";
import FoodHeader from "@/components/FoodHeader";

export default function ChefsTable() {
  return (
    <div>
      <Navbar />
      <FoodHeader />
      <FoodCTA />
      <Footer />
    </div>
  );
}
