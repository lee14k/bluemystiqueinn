import AdminNav from "../../components/AdminDash/AdminNav";
import ReservationsPageFill from "../../components/AdminDash/ReservationsPageFill";
import Navbar from "@/components/FrontEnd/Navbar";
import DinnerTable from "@/components/AdminDash/DinnerTable";

export default function AdminHome() {
  return (
    <div>
      <Navbar />
      <AdminNav />
      <DinnerTable />
    </div>
  );
}
